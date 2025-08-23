"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, usersApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createUserFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user"]),
    active: z.boolean(),
});

const editUserFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")),
    role: z.enum(["admin", "user"]),
    active: z.boolean(),
});

type UserFormData = z.infer<typeof createUserFormSchema>;

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
    mode: "create" | "edit";
}

export function UserFormDialog({
    open,
    onOpenChange,
    user,
    mode,
}: UserFormDialogProps) {
    const t = useTranslations("users");
    const queryClient = useQueryClient();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "user",
            active: true,
        },
    });

    const createUserMutation = useMutation({
        mutationFn: usersApi.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User created successfully");
            onOpenChange(false);
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create user");
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: Partial<UserFormData> }) =>
            usersApi.updateUser(slug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User updated successfully");
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user");
        },
    });

    useEffect(() => {
        if (open && mode === "edit" && user) {
            form.reset({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
                active: user.active,
            });
        } else if (open && mode === "create") {
            form.reset({
                name: "",
                email: "",
                password: "",
                role: "user",
                active: true,
            });
        }
    }, [open, mode, user, form]);

    const onSubmit = (data: UserFormData) => {
        if (mode === "create") {
            createUserMutation.mutate(data);
        } else if (mode === "edit" && user) {
            const updateData = { ...data };
            if (!data.password) {
                delete updateData.password;
            }
            updateUserMutation.mutate({ slug: user.slug, data: updateData });
        }
    };

    const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? t("addUser") : t("editUser")}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new user account with the form below."
                            : "Update user information using the form below."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password
                                        {mode === "edit" && (
                                            <span className="text-muted-foreground ml-1">
                                                (leave empty to keep current)
                                            </span>
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={
                                                mode === "edit"
                                                    ? "Enter new password"
                                                    : "Enter password"
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <div className="text-muted-foreground text-sm">
                                            User can log in and access the system
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Create User" : "Update User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}