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
import { usersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UsersPage() {
    const t = useTranslations("users");

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ["users", "all"],
        queryFn: () => usersApi.getUsers({ per_page: 50 }),
    });

    const users = usersResponse?.data?.data || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t("title")}
                        </h1>
                        <p className="text-muted-foreground">{t("subtitle")}</p>
                    </div>
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        {t("addUser")}
                    </Button>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            Manage and view all users in your system. You can
                            search, sort, and perform actions on user accounts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={users}
                            loading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
