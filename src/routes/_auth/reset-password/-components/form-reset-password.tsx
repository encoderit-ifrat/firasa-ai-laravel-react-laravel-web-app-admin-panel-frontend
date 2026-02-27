import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { PasswordInput } from "../../../../components/ui/password-input";
import { FormSchema, type TFormSchema } from "../-type/form";
import { useResetPassword } from "../-api/use-reset-password";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

type TProps = {
  email: string;
  token: string;
};

export default function FormResetPassword({ email, token }: TProps) {
  const { t } = useTranslation();
  const { mutate: resetPassword, status } = useResetPassword();

  const form = useForm<TFormSchema>({ resolver: zodResolver(FormSchema) });
  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    setValue("email", email);
    setValue("token", token);
  }, [email, token, setValue]);

  function onSubmit(values: TFormSchema) {
    resetPassword(values);
  }

  return (
    <div className="w-full max-w-[484px] mx-auto p-12 py-16 bg-white rounded-[14px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-[#3D3D3D] mb-4">
          {t("auth.resetPassword")}
        </h1>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      {t("auth.password")} *
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("auth.enterPassword")}
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] text-base"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      {t("auth.confirmPassword")} *
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("auth.confirmPassword")}
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] text-base"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              variant="customGradient"
              className="w-full h-[60px] text-lg font-bold text-black"
              loading={status === "pending"}
            >
              {t("auth.updatePassword")}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center mt-2">
          <Link
            to="/login"
            className="font-bold text-[#3D3D3D] hover:underline cursor-pointer"
          >
            {t("auth.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
