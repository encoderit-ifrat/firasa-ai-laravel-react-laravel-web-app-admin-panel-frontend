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
import { useCreateUser } from "../-api/mutations/use-create-user";
import { useUpdateUser } from "../-api/mutations/use-update-user";

type TProps = {
  open: boolean;
  onClose: () => void;
  formData?: Partial<TAdminFormSchema> & { id?: string };
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
  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();

  // Fetch roles data
  const { data: rolesResponse } = useGetAllRoleDropdown({});
  
  // Transform API data to dropdown options
  const roleOptions = useMemo(() => {
    if (!rolesResponse?.data) return [];
    
    return rolesResponse.data.map((role: RoleData) => ({
      label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
      value: role.name,
    }));
  }, [rolesResponse]);

  // Determine if this is an update operation
  const isUpdateMode = !!formData?.id;

  // Reset on edit
  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  // Submit handler
  function onSubmit(values: TAdminFormSchema) {
    if (isUpdateMode && formData?.id) {
      // Update existing admin
      updateUser(
        {
          ...values,
          id: formData.id,
        },
        {
          onSuccess: () => {
            form.reset();
            onClose();
            onSuccess?.();
          },
        }
      );
    } else {
      // Create new admin
      createUser(values, {
        onSuccess: () => {
          form.reset();
          onClose();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <AppSheet
      open={open}
      onOpenChange={onClose}
      title={isUpdateMode ? "Update Admin" : "Add New Admin"}
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
            disabled={creating || updating}
          >
            {creating || updating
              ? isUpdateMode ? "Updating..." : "Creating..."
              : isUpdateMode ? "Update Admin" : "Invite Admin"}
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