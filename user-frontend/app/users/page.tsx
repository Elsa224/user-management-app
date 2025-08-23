"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { UserTableSkeleton } from "@/components/users/user-table-skeleton";
import { usersApi, authApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function UsersPage() {
    const t = useTranslations("users");
    const [showAddDialog, setShowAddDialog] = useState(false);

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ["users", "all"],
        queryFn: () => usersApi.getUsers({ per_page: 50 }),
    });

    // Get current user to check permissions
    const { data: currentUserResponse } = useQuery({
        queryKey: ["current-user"],
        queryFn: authApi.me,
    });
    const currentUser = currentUserResponse?.data;
    const isCurrentUserAdmin = currentUser?.role === "admin";

    const users = usersResponse?.data?.data || [];

    return (
        <DashboardLayout>
            <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                        <p className="text-muted-foreground">{t("subtitle")}</p>
                    </div>
                    {isCurrentUserAdmin && (
                        <Button onClick={() => setShowAddDialog(true)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t("addUser")}
                        </Button>
                    )}
                </div>

                {/* Users Table */}
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("allUsers")}</CardTitle>
                            <CardDescription>
                                {t("manageUsersDescription")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <UserTableSkeleton />
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={users}
                                    loading={isLoading}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Add User Dialog */}
                <UserFormDialog
                    open={showAddDialog}
                    onOpenChange={setShowAddDialog}
                    mode="create"
                />
            </div>
        </DashboardLayout>
    );
}
