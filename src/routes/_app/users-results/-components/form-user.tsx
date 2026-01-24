import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppSheet from "../../../../components/app-sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";

import { UserFormSchema, type TUserFormSchema } from "../-type/form";

type TProps = {
  open: boolean;
  onClose: () => void;
  formData?: Partial<TUserFormSchema>;
  onSuccess?: () => void;
};

export default function FormUser({
  open,
  onClose,
  formData,
  onSuccess,
}: TProps) {
  const form = useForm<TUserFormSchema>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      datetime: "",
      ...formData,
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  console.log("🚀 ~ FormUser ~ errors :", errors);

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  const onSubmit = (data: TUserFormSchema) => {
    console.log("Submitted user data:", data);
    reset();
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={onClose}
      title={formData ? "Update User" : "Add New User"}
      actions={
        <>
          <Button
            type="button"
            variant="gray"
            size="lg"
            onClick={() => {
              reset();
              onClose();
            }}
            className="capitalize"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="customGradient"
            onClick={handleSubmit(onSubmit)}
          >
            {formData ? "Update" : "Create"}
          </Button>
        </>
      }
    >


      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
          {/* NAME */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GENDER */}
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE & TIME */}
          <FormField
            control={control}
            name="datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AppSheet>
  );
}