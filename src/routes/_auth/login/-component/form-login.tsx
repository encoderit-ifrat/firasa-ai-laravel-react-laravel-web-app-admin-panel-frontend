import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { FORM_DATA } from "../-data";
import { FormSchema, type TFormSchema } from "../-type";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "../-api/use-login";


export const FormLogin = () => {
  // API hook
  const { mutate: login, status } = useLogin();

  // Form setup
  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: FORM_DATA,
    
  });

  // Submit handler
   function onSubmit(values: TFormSchema) {
     login({
       ...values,
       type: "admin",
     });
   }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full text-custom-header-text">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your_email@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm">Remember me</span>
          </div>

          <Link to="/forgot-password" className="text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="active"
          className="w-full mb-12"
          loading={status === "pending"}
        >
          Login
        </Button>
      </form>
    </Form>
  );
};
