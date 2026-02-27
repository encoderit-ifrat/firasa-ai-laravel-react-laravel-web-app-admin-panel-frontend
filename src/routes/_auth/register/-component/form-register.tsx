import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
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
import { useRegister } from "../-api/use-register";
import { Link } from "@tanstack/react-router";

export function FormRegister() {
  const { t } = useTranslation();
  const { mutate: register, isPending } = useRegister();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: TFormSchema) => {
    register(values);
  };

  return (
    <div className="w-full max-w-[484px] mx-auto p-12 py-16 bg-white rounded-[14px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-[#3D3D3D] mb-4">
          {t("auth.createAccount")}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      {t("auth.fullName")} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] placeholder:text-[#9CA3AF] text-base"
                        placeholder={t("common.johnDoe")}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      {t("auth.email")} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] placeholder:text-[#9CA3AF] text-base"
                        placeholder={t("common.mailPlaceholder")}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] placeholder:text-[#9CA3AF] text-base"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] text-base placeholder:text-[#9CA3AF]"
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
              loading={isPending}
              variant="customGradient"
              className="w-full h-[60px] text-lg font-bold text-black"
            >
              {t("auth.signUp")}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center gap-1.5 mt-2 text-sm text-[#6B7280]">
          <span>{t("auth.alreadyHaveAccount")}</span>
          <Link
            to="/login"
            className="font-bold text-[#3D3D3D] hover:underline cursor-pointer"
          >
            {t("auth.signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
