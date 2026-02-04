import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { mutate: resetPassword, status } = useResetPassword();

  const form = useForm<TFormSchema>({ resolver: zodResolver(FormSchema) });
  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    setValue("email", email);
    setValue("token", token);
  }, [email, token, setValue])

  function onSubmit(values: TFormSchema) {
    resetPassword(values);
  }

  return (
    <div className="w-full max-w-[484px] mx-auto p-12 py-16 bg-white rounded-[24px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-[#3D3D3D] mb-4">Reset Password</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-2 left-3 px-1 text-xs font-medium text-black z-10">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter password"
                      className="h-[60px] px-[16px] py-[24px] border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-2 left-3 px-1 text-xs font-medium text-black z-10">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm password"
                      className="h-[60px] px-[16px] py-[24px] border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] text-base"
                      {...field}
                    />
                  </FormControl>
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
              Update Password
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center mt-2">
          <Link
            to="/login"
            className="font-bold text-[#3D3D3D] hover:underline cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
