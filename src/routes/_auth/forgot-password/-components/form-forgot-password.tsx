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
import { FormSchema, type TFormSchema } from "../-type/form";
import { useForgotPassword } from "../-api";
import { Input } from "../../../../components/ui/input";
import { Link } from "@tanstack/react-router";



export default function FormForgotPassword() {
  const { mutate: forgotPassword, status } = useForgotPassword();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { control, handleSubmit } = form;

  function onSubmit(values: TFormSchema) {
    forgotPassword({
      email: values.email,
      redirect_url: `${window.location.origin}`,
    });
  }

  return (
    <div className="w-full max-w-[484px] mx-auto p-12 py-16 bg-white rounded-[14px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-[#3D3D3D] mb-4">Forgot Password</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="group relative">
                    <FormLabel className="-translate-y-1/2 absolute start-1 top-0 z-10 block bg-white px-2 text-xs text-[#3D3D3D]">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-[60px] px-4 py-6 border-[#E5E7EB] rounded-[6px] focus:ring-0 focus:border-[#FF5B4D] placeholder:text-[#9CA3AF] text-base"
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
              Submit
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center gap-1.5 mt-2 text-sm text-[#6B7280]">
          <Link
            to="/login"
            className="font-bold text-[#3D3D3D] hover:text-[#3D3D3D] transition-colors hover:underline cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
