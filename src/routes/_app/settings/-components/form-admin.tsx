import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

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

import { AdminFormSchema, type TAdminFormSchema } from "../-type/admin-form";
import { useGetAllRoleDropdown } from "../-api/queries/use-dropdown-role";
import { useCreateUser } from "../-api/mutations/use-create-user";
import { useUpdateUser } from "../-api/mutations/use-update-user";

type TProps = {
  open: boolean;
  onClose: () => void;
  formData?: Partial<TAdminFormSchema>;
  onSuccess?: () => void;
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
  const { t } = useTranslation();
  const form = useForm<TAdminFormSchema>({
    resolver: zodResolver(AdminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      roles: [],
      ...formData,
    },
  });

  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();

  // Fetch roles - API returns { data: [...], meta: {...} }
  const { data: rolesResponse } = useGetAllRoleDropdown({});
  console.log("🚀 ~ FormAdmin ~ rolesResponse:", rolesResponse);

  // Determine if this is an update operation
  const isUpdateMode = !!formData?.id;

  useEffect(() => {
    if (formData) {
      // Transform roles from array of objects to array of IDs
      const transformedData = {
        ...formData,
        roles: Array.isArray(formData.roles)
          ? formData.roles.map((role: number | RoleData) =>
              typeof role === "object" ? role.id : role,
            )
          : formData.roles,
      };
      console.log("🚀 ~ Transformed formData for editing:", transformedData);
      form.reset(transformedData);
    }
  }, [formData, form]);

  function onSubmit(values: TAdminFormSchema) {
    console.log("🚀 ~ Submitting values:", values);

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
        },
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
      title={
        isUpdateMode ? t("settings.updateAdmin") : t("settings.addNewAdmin")
      }
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
            {t("common.cancel")}
          </Button>

          <Button
            type="submit"
            size="lg"
            variant="customGradient"
            form="admin-form"
            disabled={creating || updating}
          >
            {creating || updating
              ? isUpdateMode
                ? t("settings.updating")
                : t("settings.creating")
              : isUpdateMode
                ? t("settings.updateAdmin")
                : t("settings.inviteAdmin")}
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
                <FormLabel>{t("settings.fullName")} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("settings.fullName") + "..."}
                    {...field}
                  />
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
                <FormLabel>{t("auth.email")} *</FormLabel>
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

          {/* ROLES */}
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.role")} *</FormLabel>
                <FormControl>
                  <DropdownSelect
                    value={
                      field.value?.[0] ? String(field.value[0]) : undefined
                    }
                    options={
                      rolesResponse?.data?.map((role: RoleData) => ({
                        label:
                          role.name.charAt(0).toUpperCase() +
                          role.name.slice(1),
                        value: String(role.id),
                      })) ?? []
                    }
                    placeholder={t("settings.selectRole")}
                    onChange={(value) => field.onChange([Number(value)])}
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
