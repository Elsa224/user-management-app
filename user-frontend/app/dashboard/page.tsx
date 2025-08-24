"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardStatsSkeleton } from "@/components/skeletons/dashboard-stats-skeleton";
import { RecentUsersSkeleton } from "@/components/skeletons/recent-users-skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { dashboardApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
    ActivityIcon,
    ShieldIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    UserCheckIcon,
    UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations("dashboard");

    // Get dashboard stats from API
    const { data: statsResponse, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => dashboardApi.getStats(),
    });

    // Get recent users from API
    const { data: recentUsersResponse, isLoading: recentUsersLoading } =
        useQuery({
            queryKey: ["recent-users"],
            queryFn: () => dashboardApi.getRecentUsers(5),
        });

    const stats = statsResponse?.data || ({} as any);
    const recentUsers = recentUsersResponse?.data || [];
    const isLoading = statsLoading || recentUsersLoading;

    return (
        <DashboardLayout>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {t("title")}
                        </h2>
                    </div>

                    {/* Stats Cards */}
                    {isLoading ? (
                        <DashboardStatsSkeleton />
                    ) : (
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
                                        {stats.total_users || 0}
                                    </div>
                                    <div className="text-muted-foreground flex items-center text-xs">
                                        {stats.growth_rate >= 0 ? (
                                            <TrendingUpIcon className="mr-1 h-3 w-3 text-green-600" />
                                        ) : (
                                            <TrendingDownIcon className="mr-1 h-3 w-3 text-red-600" />
                                        )}
                                        <span
                                            className={
                                                stats.growth_rate >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {Math.abs(stats.growth_rate || 0)}%
                                            {` `}
                                            {t("fromLastWeek")}
                                        </span>
                                    </div>
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
                                        {stats.active_users || 0}
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        {t("inactiveUsersCount", { count: stats.inactive_users || 0 })}
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
                                        {stats.admin_users || 0}
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        {t("regularUsersCount", { count: stats.regular_users || 0 })}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {t("recentUsersCard")}
                                    </CardTitle>
                                    <ActivityIcon className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.recent_users || 0}
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        {t("last7Days")}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Recent Users Table */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {isLoading ? (
                            <>
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>
                                            {t("recentUsers")}
                                        </CardTitle>
                                        <CardDescription>
                                            {t("recentUsersDescription")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <DataTable
                                            columns={columns.slice(0, 4)} // Show fewer columns in dashboard
                                            data={[]}
                                            loading={true}
                                        />
                                    </CardContent>
                                </Card>
                                <RecentUsersSkeleton />
                            </>
                        ) : (
                            <>
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>
                                            {t("recentUsers")}
                                        </CardTitle>
                                        <CardDescription>
                                            {t("recentUsersDescription")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <DataTable
                                            columns={columns.slice(0, 4)} // Show fewer columns in dashboard
                                            data={recentUsers}
                                            loading={isLoading}
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>{t("overview")}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            <div className="flex items-center">
                                                <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                                                    <UsersIcon className="h-4 w-4" />
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm leading-none font-medium">
                                                        {t("totalUsers")}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {stats.total_users || 0}{" "}
                                                        {t("registeredUsers")}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    {stats.total_users || 0}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                                                    <UserCheckIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm leading-none font-medium">
                                                        {t("activeUsers")}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {Math.round(
                                                            ((stats.active_users ||
                                                                0) /
                                                                (stats.total_users ||
                                                                    1)) *
                                                                100
                                                        )}
                                                        % {t("ofTotal")}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    {stats.active_users || 0}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                                                    <ShieldIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm leading-none font-medium">
                                                        {t("adminUsers")}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {t(
                                                            "systemAdministrators"
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    {stats.admin_users || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// DashboardPage translations used:
// (Add these to your messages file under the "dashboard" namespace)
/*
{
    "title": "Dashboard",
    "totalUsers": "Total Users",
    "fromLastWeek": "from last week",
    "activeUsers": "Active Users",
    "inactiveUsersCount": "{count} inactive",
    "adminUsers": "Admin Users",
    "regularUsersCount": "{count} regular users",
    "recentUsersCard": "Recent Users",
    "last7Days": "Last 7 days",
    "recentUsers": "Recent Users",
    "recentUsersDescription": "The most recently registered users",
    "overview": "Overview",
    "registeredUsers": "registered users",
    "ofTotal": "of total",
    "systemAdministrators": "System administrators"
}
*/
