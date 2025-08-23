"use client";

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
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { User, usersApi } from "@/lib/api";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

function ActionsCell({ user }: { user: User }) {
    const t = useTranslations("common");
    const [showEditDialog, setShowEditDialog] = useState(false);
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationFn: (slug: string) => usersApi.deleteUser(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUserMutation.mutate(user.slug);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user.slug)}
                >
                    Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    {t("edit")} user
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    {t("delete")} user
                </DropdownMenuItem>
            </DropdownMenuContent>
            <UserFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                mode="edit"
                user={user}
            />
        </DropdownMenu>
    );
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Name
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Email
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
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return (
                <Badge variant={role === "admin" ? "default" : "secondary"}>
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("active") as boolean;
            return (
                <Badge variant={isActive ? "success" : "destructive"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Created
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsCell user={row.original} />,
    },
];
