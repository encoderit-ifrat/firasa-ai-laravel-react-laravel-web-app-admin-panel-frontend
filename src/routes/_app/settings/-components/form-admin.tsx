import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription,
    
    SheetHeader, SheetTitle } from "../../../../components/ui/sheet";
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
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <SheetTitle>
                            {formData ? "Update Admin" : "Add New Admin"}
                        </SheetTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    reset();
                                    onClose();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                size="sm"
                                variant="customGradient"
                                onClick={handleSubmit(onSubmit)}
                            >
                                {formData ? "Update Admin" : "Invite Admin"}
                            </Button>
                        </div>
                    </div>
                    <SheetDescription>
                        {formData 
                            ? "Update the admin information below" 
                            : "Fill in the details to invite a new admin"}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
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
            </SheetContent>
        </Sheet>
    );
}