
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { PasswordInput } from "../../../../components/ui/password-input";
import { FormSchema, type TFormSchema } from "../-type/form";
import { useLogin } from "../-api/use-login";
import { Link } from "@tanstack/react-router";

export function FormLogin() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      type: "admin",
    },
  });

  const onSubmit = (values: TFormSchema) => {
    login(values);
  };

  return (
    <div className="w-full max-w-[484px] mx-auto p-12 py-16 bg-white rounded-[14px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-[#3D3D3D] mb-4">Sign in to Faraseh</h1>

        {/* <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full bg-white border-[#E5E7EB] hover:bg-gray-50 h-[66px] rounded-[14px] px-6 py-3 gap-4 text-[#3D3D3D] font-medium text-base shadow-sm border-[1px] opacity-100"
          >
            <IconGoogle />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white border-[#E5E7EB] hover:bg-gray-50 h-[66px] rounded-[14px] px-6 py-3 gap-4 text-[#3D3D3D] font-medium text-base shadow-sm border-[1px] opacity-100"
          >
            <IconApple />
            Continue with Apple
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white border-[#E5E7EB] hover:bg-gray-50 h-[66px] rounded-[14px] px-6 py-3 gap-4 text-[#3D3D3D] font-medium text-base shadow-sm border-[1px] opacity-100"
          >
            <IconFacebook />
            Continue with facebook
          </Button>
        </div>


        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
          <span className="flex-shrink mx-4 text-sm text-[#9CA3AF]">Or</span>
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
        </div> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] placeholder:text-[#9CA3AF] text-base"
                        placeholder="mail@domain.com"
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
                      Password *
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter password"
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
              variant="customGradient"
              size="lg"
              loading={isPending}
              className="w-full h-[60px] text-lg font-bold text-black"
            >
              Sign in
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center gap-1.5 mt-2 text-sm text-[#6B7280]">
          <Link to="/forgot-password" title="Forgot Password" className="font-bold text-[#3D3D3D] hover:text-[#3D3D3D] transition-colors hover:underline cursor-pointer">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}