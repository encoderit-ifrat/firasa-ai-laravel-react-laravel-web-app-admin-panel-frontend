import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { FormSchema, type TFormSchema } from "../-type";
import { useResetPassword } from "../-api/use-reset-password";
import { useEffect } from "react";

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
    console.log("Form submitted:", values);
    resetPassword(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 w-full text-custom-header-text"
      >
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>

                  <PasswordInput placeholder="Enter your password" {...field} />
   
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="active"
          className="w-full mb-8"
          loading={status === "pending"}
        >
          Update
        </Button>
      
      </form>
    </Form>
  );
}
