"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
import {
    ActivityIcon,
    ShieldIcon,
    UserCheckIcon,
    UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations("dashboard");

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => usersApi.getUsers({ per_page: 10 }),
    });

    const users = usersResponse?.data?.data || [];
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.active).length;
    const adminUsers = users.filter(user => user.role === "admin").length;
    const recentUsers = users.slice(0, 5);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t("totalUsers")}
                            </CardTitle>
                            <UsersIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalUsers}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t("activeUsers")}
                            </CardTitle>
                            <UserCheckIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeUsers}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                +1 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t("adminUsers")}
                            </CardTitle>
                            <ShieldIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {adminUsers}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                No change
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Sessions
                            </CardTitle>
                            <ActivityIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.floor(activeUsers * 0.8)}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                +5% from last hour
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("recentUsers")}</CardTitle>
                        <CardDescription>
                            A list of recently registered users in your system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={recentUsers}
                            loading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
