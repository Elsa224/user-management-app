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
import { LoadingButton } from "@/components/ui/loading-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { authApi, User, usersApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createUserFormSchema = z.object({
    name: z.string().min(1, "users:nameRequired").max(255),
    email: z.string().email("users:invalidEmail"),
    password: z.string().min(6, "users:passwordMin"),
    role: z.enum(["admin", "user"]),
    active: z.boolean(),
});

const editUserFormSchema = z.object({
    name: z.string().min(1, "users:nameRequired").max(255),
    email: z.string().email("users:invalidEmail"),
    password: z.string().min(6, "users:passwordMin").or(z.literal("")),
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
    const commonT = useTranslations("common");
    const queryClient = useQueryClient();

    // Get current user to check permissions
    const { data: currentUserResponse } = useQuery({
        queryKey: ["current-user"],
        queryFn: authApi.me,
    });
    const currentUser = currentUserResponse?.data;
    const isCurrentUserAdmin = currentUser?.role === "admin";

    const form = useForm<UserFormData>({
        resolver: zodResolver(
            mode === "create" ? createUserFormSchema : editUserFormSchema
        ),
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
            toast.success(t("userCreateSuccess"));
            onOpenChange(false);
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("userCreateError"));
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({
            slug,
            data,
        }: {
            slug: string;
            data: Partial<UserFormData>;
        }) => usersApi.updateUser(slug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(t("userUpdateSuccess"));
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("userUpdateError"));
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
        // Only admin users can create new users
        if (mode === "create" && !isCurrentUserAdmin) {
            toast.error(t("onlyAdminsCanCreate"));
            return;
        }

        // Only admin users can edit other users
        if (
            mode === "edit" &&
            !isCurrentUserAdmin &&
            user?.slug !== currentUser?.slug
        ) {
            toast.error(t("editOwnProfileOnly"));
            return;
        }

        if (mode === "create") {
            createUserMutation.mutate(data);
        } else if (mode === "edit" && user) {
            const updateData = { ...data };
            if (!data.password) {
                delete (updateData as any).password;
            }
            // Non-admin users can't change their own role or active status
            if (!isCurrentUserAdmin && user.slug === currentUser?.slug) {
                delete (updateData as any).role;
                delete (updateData as any).active;
            }
            updateUserMutation.mutate({ slug: user.slug, data: updateData });
        }
    };

    const isLoading =
        createUserMutation.isPending || updateUserMutation.isPending;

    // Check if current user is editing their own profile (non-admin)
    const isEditingOwnProfile =
        mode === "edit" &&
        !isCurrentUserAdmin &&
        user?.slug === currentUser?.slug;
    const canManageRoleAndStatus = isCurrentUserAdmin || mode === "create";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="mx-4 max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? t("addUser") : t("editUser")}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? t("addUserDescription")
                            : t("editUserDescription")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Basic Info Section */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {commonT("name")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "namePlaceholder"
                                                    )}
                                                    {...field}
                                                />
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
                                            <FormLabel>
                                                {commonT("email")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder={t(
                                                        "emailPlaceholder"
                                                    )}
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
                                            <FormLabel className="text-sm">
                                                {commonT("password")}
                                                {mode === "edit" && (
                                                    <span className="text-muted-foreground ml-1 block text-xs font-normal sm:inline sm:text-sm">
                                                        {t(
                                                            "leaveEmptyToKeepCurrent"
                                                        )}
                                                    </span>
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder={
                                                        mode === "edit"
                                                            ? t(
                                                                  "newPasswordPlaceholder"
                                                              )
                                                            : t(
                                                                  "passwordPlaceholder"
                                                              )
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Role and Status Section */}
                        {canManageRoleAndStatus && (
                            <div className="space-y-4 border-t pt-2">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {commonT("role")}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                "rolePlaceholder"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="user">
                                                        {commonT("user")}
                                                    </SelectItem>
                                                    <SelectItem value="admin">
                                                        {commonT("admin")}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="sm:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="active"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm sm:text-base">
                                                        {commonT("active")}
                                                    </FormLabel>
                                                    <div className="text-muted-foreground text-xs sm:text-sm">
                                                        {t(
                                                            "activeStatusDescription"
                                                        )}
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                            >
                                {commonT("cancel")}
                            </Button>
                            <LoadingButton
                                type="submit"
                                loading={isLoading}
                                loadingText={
                                    mode === "create"
                                        ? commonT("creating")
                                        : commonT("updating")
                                }
                                className="w-full sm:w-auto"
                            >
                                {mode === "create"
                                    ? t("addUser")
                                    : t("editUser")}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- TRANSLATIONS TO ADD ---
//
// In your messages/en.json (or other locale files), add the following under the "users" namespace:
//
// "users": {
//   ...
//   "nameRequired": "Name is required",
//   "invalidEmail": "Invalid email address",
//   "passwordMin": "Password must be at least 6 characters",
//   "userCreateSuccess": "User created successfully",
//   "userCreateError": "Failed to create user",
//   "userUpdateSuccess": "User updated successfully",
//   "userUpdateError": "Failed to update user",
//   "onlyAdminsCanCreate": "Only administrators can create new users",
//   "editOwnProfileOnly": "You can only edit your own profile",
//   "addUserDescription": "Create a new user account with the form below.",
//   "editUserDescription": "Update user information using the form below.",
//   "namePlaceholder": "Enter full name",
//   "emailPlaceholder": "Enter email address",
//   "passwordPlaceholder": "Enter password",
//   "newPasswordPlaceholder": "Enter new password",
//   "leaveEmptyToKeepCurrent": "(leave empty to keep current)",
//   "rolePlaceholder": "Select a role",
//   "activeStatusDescription": "User can log in and access the system"
// }
//
// (Add these keys if they do not already exist.)
