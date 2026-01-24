import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppSheet from "../../../../components/app-sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

import {
    AdminFormSchema,
    type TAdminFormSchema,
} from "../-type/admin-form";
import { DropdownSelect } from "../../../../components/DropdownSelect";

type TProps = {
    open: boolean;
    onClose: () => void;
    formData?: Partial<TAdminFormSchema>;
    onSuccess?: () => void;
};

export const ROLE_OPTIONS = [
    {
        label: "Admin",
        value: "admin",
    },
    {
        label: "Super Admin",
        value: "super_admin",
    },
    {
        label: "Manager",
        value: "manager",
    },
];

export default function FormAdmin({
    open,
    onClose,
    formData,
    onSuccess,
}: TProps) {
    const form = useForm<TAdminFormSchema>({
        resolver: zodResolver(AdminFormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            ...formData,
        },
    });

    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (formData) reset(formData);
    }, [formData, reset]);

    const onSubmit = (data: TAdminFormSchema) => {
        console.log("Submitted admin data:", data);
        reset();
        onClose();
        onSuccess?.();
    };

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
                        size="lg" // Matched FormUser size
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
                        size="lg" // Matched FormUser size
                        variant="customGradient"
                        onClick={handleSubmit(onSubmit)}
                    >
                        {formData ? "Update Admin" : "Invite Admin"}
                    </Button>
                </div>
            }
        >


            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* FULL NAME */}
                    <FormField
                        control={control}
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
                        control={control}
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
                        control={control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role *</FormLabel>
                                <FormControl>
                                    <DropdownSelect
                                        value={field.value}
                                        options={ROLE_OPTIONS}
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