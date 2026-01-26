import { useEffect, useMemo } from "react";
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
import { Button } from "../../../../components/ui/button";
import { DropdownSelect } from "../../../../components/DropdownSelect";
import type { z } from "zod";

import {
  AdminFormSchema,
  type TAdminFormSchema,
} from "../-type/admin-form";
import type { RoleEnum } from "../-type/admin";
import { useGetAllRoleDropdown } from "../-api/queries/use-dropdown-role";
import { useCreateAdmin } from "../-api/mutations/use-create-admin";

type TProps = {
  open: boolean;
  onClose: () => void;
  formData?: Partial<TAdminFormSchema>;
  onSuccess?: () => void;
};

export type RoleOption = {
  label: string;
  value: z.infer<typeof RoleEnum>;
};

type RoleData = {
  id: number;
  name: string;
  guard_name: string;
  permission_count: number;
  user_count: number;
  created_at: string;
  updated_at: string;
  deletable: boolean;
  can_assign_permission: boolean;
};

export default function FormAdmin({
  open,
  onClose,
  formData,
  onSuccess,
}: TProps) {
  // Form setup
  const form = useForm<TAdminFormSchema>({
    resolver: zodResolver(AdminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
      ...formData,
    },
  });

  // API mutations
  const createAdmin = useCreateAdmin();

  // Fetch roles data
  const { data: rolesResponse } = useGetAllRoleDropdown({});
  
  // Transform API data to dropdown options
  const roleOptions = useMemo(() => {
    if (!rolesResponse?.data) return [];
    
    return rolesResponse.data.map((role: RoleData) => ({
      label: role.name,
      value: role.name,
    }));
  }, [rolesResponse]);

  console.log("🚀 ~ FormAdmin ~ roleOptions:", roleOptions);

  // Reset on edit
  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  // Submit handler
  async function onSubmit(values: TAdminFormSchema) {
    try {
      await createAdmin.mutateAsync(values);
      
      form.reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      // Error is already handled in the mutation's onError
      console.error("Failed to submit admin:", error);
    }
  }

  return (
    <AppSheet
      open={open}
      onOpenChange={onClose}
      title={formData ? "Update Admin" : "Add New Admin"}
      actions={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="gray"
            size="lg"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            variant="customGradient"
            form="admin-form"
            disabled={createAdmin.isPending}
          >
            {createAdmin.isPending 
              ? "Creating..." 
              : formData ? "Update Admin" : "Invite Admin"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="admin-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          {/* FULL NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="mail@domain.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROLE */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <FormControl>
                  <DropdownSelect
                    value={field.value}
                    options={roleOptions}
                    placeholder="Select role"
                    onChange={field.onChange}
                    className="w-full"
                  />
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