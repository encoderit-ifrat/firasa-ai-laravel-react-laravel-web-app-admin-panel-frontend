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
import { FormSchema, type TFormSchema } from "../-type/form";
import { useForgotPassword } from "../-api";
import { Input } from "@/components/ui/input";



export default function FormForgotPassword() {
  const {mutate:forgotPassword, status } = useForgotPassword();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
  });

  const { control, handleSubmit } = form;

   function onSubmit(values: TFormSchema) {
    forgotPassword({
      email: values.email,
      redirect_url: `${window.location.origin}`
    });
  }

  return (
  
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 w-full text-custom-header-text"
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="gradient-border w-full">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="relative z-10"
                    
                      {...field}
                    />
                  </div>
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
            Submit
          </Button>
        </form>
      </Form>

  );
}
