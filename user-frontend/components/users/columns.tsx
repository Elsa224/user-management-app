"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { authApi, User, usersApi } from "@/lib/api";
import { getImageUrl } from "@/lib/image-utils";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

function ActionsCell({ user }: { user: User }) {
    const t = useTranslations("common");
    const tUsers = useTranslations("users.table");
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const queryClient = useQueryClient();

    // Get current user to check permissions
    const { data: currentUserResponse } = useQuery({
        queryKey: ["current-user"],
        queryFn: authApi.me,
    });
    const currentUser = currentUserResponse?.data;
    const isCurrentUserAdmin = currentUser?.role === "admin";
    const canEditUser = isCurrentUserAdmin || user.slug === currentUser?.slug;
    const canDeleteUser = isCurrentUserAdmin && user.slug !== currentUser?.slug;

    const deleteUserMutation = useMutation({
        mutationFn: (slug: string) => usersApi.deleteUser(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(tUsers("userDeletedSuccess"));
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || tUsers("userDeleteFailed")
            );
        },
    });

    const handleDelete = () => {
        if (!canDeleteUser) {
            toast.error(tUsers("noDeletePermission"));
            return;
        }
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        deleteUserMutation.mutate(user.slug);
        setShowDeleteDialog(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{tUsers("openMenu")}</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user.slug)}
                >
                    {tUsers("copyUserId")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canEditUser && (
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        {t("edit")} {tUsers("user")}
                    </DropdownMenuItem>
                )}
                {canDeleteUser && (
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600"
                    >
                        {t("delete")} {tUsers("user")}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
            <UserFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                mode="edit"
                user={user}
            />
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title={tUsers("deleteUserTitle")}
                description={`${tUsers("deleteUserDescription")} "${user.name}"? This action cannot be undone and will permanently remove all user data.`}
                confirmText={t("delete")}
                cancelText={t("cancel")}
                onConfirm={confirmDelete}
                variant="destructive"
                loading={deleteUserMutation.isPending}
            />
        </DropdownMenu>
    );
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    {tUsers("name")}
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={getImageUrl(user.profile_photo)}
                            alt={user.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-xs font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.name}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    {tUsers("email")}
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "role",
        header: () => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            return tUsers("role");
        },
        cell: ({ row }) => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            const role = row.getValue("role") as string;
            return (
                <Badge variant={role === "admin" ? "default" : "secondary"}>
                    {tUsers(role)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "active",
        header: () => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            return tUsers("status");
        },
        cell: ({ row }) => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            const isActive = row.getValue("active") as boolean;
            return (
                <Badge variant={isActive ? "success" : "destructive"}>
                    {isActive ? tUsers("active") : tUsers("inactive")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            //@ts-ignore
            const tUsers = useTranslations("users.table");
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    {tUsers("created")}
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            const locale = useLocale();
            return <div>{formatDate(date.toLocaleDateString(), locale)}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsCell user={row.original} />,
    },
];
