"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { activityLogsApi } from "@/lib/api";
import { useAuth } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
    ActivityIcon,
    BarChart3Icon,
    ClockIcon,
    DownloadIcon,
    RefreshCwIcon,
    SearchIcon,
    UserIcon,
    UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAction, setFilterAction] = useState("");
    const [filterUser, setFilterUser] = useState("");
    const { user } = useAuth();
    const t = useTranslations("settings");
    const commonT = useTranslations("common");
    const router = useRouter();

    // Prepare query parameters
    const queryParams = useMemo(
        () => ({
            action:
                filterAction === "all" || !filterAction
                    ? undefined
                    : filterAction,
            user_id:
                filterUser === "all" ||
                !filterUser ||
                isNaN(parseInt(filterUser))
                    ? undefined
                    : parseInt(filterUser),
            per_page: 50,
        }),
        [searchTerm, filterAction, filterUser]
    );

    // Get activity logs using React Query
    const {
        data: activityLogsResponse,
        isLoading,
        refetch: refetchActivityLogs,
    } = useQuery({
        queryKey: ["activity-logs", queryParams],
        queryFn: () => activityLogsApi.getLogs(queryParams),
        enabled: user?.role === "admin",
    });

    const activityLogs = activityLogsResponse?.data?.data || [];

    // Redirect non-admin users
    useEffect(() => {
        if (user && user.role !== "admin") {
            router.push("/dashboard");
            toast.error("Access denied. Admin privileges required.");
        }
    }, [user, router]);

    const exportLogs = async () => {
        try {
            // For now, let's create a simple CSV export from the current data
            const csvContent = [
                ["User", "Action", "Resource", "Timestamp", "IP Address"].join(
                    ","
                ),
                ...activityLogs.map(log =>
                    [
                        log.user.name,
                        log.action,
                        `${log.target_type || "N/A"} (${log.target_slug || "N/A"})`,
                        formatTimestamp(log.created_at),
                        log.ip_address || "N/A",
                    ].join(",")
                ),
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Activity logs exported successfully");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export activity logs");
        }
    };

    // Format action names for display
    const formatAction = (action: string) => {
        return action
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Format timestamp
    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    // Don't render if not admin
    if (!user || user.role !== "admin") {
        return null;
    }

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

                {/* Settings Overview Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="bg-card text-card-foreground rounded-lg border p-6">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                <ActivityIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {t("activityLogs")}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {t("activityLogsDescription")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-lg border p-6">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                                <BarChart3Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {t("systemStats")}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {t("systemStatsDescription")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-lg border p-6">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/20">
                                <UsersIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {t("userManagement")}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {t("userManagementDescription")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Logs Section */}
                <div className="bg-card text-card-foreground rounded-lg border">
                    <div className="border-b p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {t("allActivityLogs")}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {t("activityLogsDescription")}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchActivityLogs()}
                                >
                                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                                    {t("refreshLogs")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={exportLogs}
                                >
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    {t("exportLogs")}
                                </Button>
                            </div>
                        </div>

                        {/* Responsive Filters */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search activity logs..."
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filterAction}
                                onValueChange={setFilterAction}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t("filterByAction")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Actions
                                    </SelectItem>
                                    <SelectItem value="created_user">
                                        Created User
                                    </SelectItem>
                                    <SelectItem value="updated_user">
                                        Updated User
                                    </SelectItem>
                                    <SelectItem value="deleted_user">
                                        Deleted User
                                    </SelectItem>
                                    <SelectItem value="user_login">
                                        User Login
                                    </SelectItem>
                                    <SelectItem value="user_logout">
                                        User Logout
                                    </SelectItem>
                                    <SelectItem value="updated_profile_photo">
                                        Updated Profile Photo
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterUser}
                                onValueChange={setFilterUser}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t("filterByUser")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Users
                                    </SelectItem>
                                    {/* In a real app, you'd populate this from API */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Activity Logs Table */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="py-8 text-center">
                                <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                                <p className="text-muted-foreground mt-2">
                                    {t("loadingLogs")}
                                </p>
                            </div>
                        ) : activityLogs.length === 0 ? (
                            <div className="py-8 text-center">
                                <ActivityIcon className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
                                <p className="text-muted-foreground">
                                    {t("noActivityLogs")}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-3 text-sm font-semibold">
                                                    {t("user")}
                                                </th>
                                                <th className="pb-3 text-sm font-semibold">
                                                    {t("action")}
                                                </th>
                                                <th className="pb-3 text-sm font-semibold">
                                                    {t("resource")}
                                                </th>
                                                <th className="pb-3 text-sm font-semibold">
                                                    {t("timestamp")}
                                                </th>
                                                <th className="pb-3 text-sm font-semibold">
                                                    {t("details")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activityLogs.map(log => (
                                                <tr
                                                    key={log.id}
                                                    className="hover:bg-muted/50 border-b transition-colors"
                                                >
                                                    <td className="py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <UserIcon className="text-muted-foreground h-4 w-4" />
                                                            <span className="font-medium">
                                                                {log.user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                                                log.action.includes(
                                                                    "created"
                                                                ) &&
                                                                    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                                                                log.action.includes(
                                                                    "updated"
                                                                ) &&
                                                                    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                                                                log.action.includes(
                                                                    "deleted"
                                                                ) &&
                                                                    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                                                                log.action.includes(
                                                                    "login"
                                                                ) &&
                                                                    "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
                                                                log.action.includes(
                                                                    "logout"
                                                                ) &&
                                                                    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                            )}
                                                        >
                                                            {formatAction(
                                                                log.action
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted-foreground py-3">
                                                        {log.target_type ||
                                                            "N/A"}{" "}
                                                        (
                                                        {log.target_slug ||
                                                            "N/A"}
                                                        )
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                                                            <ClockIcon className="h-4 w-4" />
                                                            <span>
                                                                {formatTimestamp(
                                                                    log.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-muted-foreground text-xs">
                                                            <div>
                                                                IP:{" "}
                                                                {log.ip_address ||
                                                                    "N/A"}
                                                            </div>
                                                            {log.changes &&
                                                                Object.keys(
                                                                    log.changes
                                                                ).length >
                                                                    0 && (
                                                                    <div className="mt-1">
                                                                        {Object.entries(
                                                                            log.changes
                                                                        )
                                                                            .slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .map(
                                                                                ([
                                                                                    key,
                                                                                    value,
                                                                                ]) => (
                                                                                    <div
                                                                                        key={
                                                                                            key
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            key
                                                                                        }
                                                                                        :{" "}
                                                                                        {typeof value ===
                                                                                        "object"
                                                                                            ? JSON.stringify(
                                                                                                  value
                                                                                              )
                                                                                            : String(
                                                                                                  value
                                                                                              )}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="space-y-4 md:hidden">
                                    {activityLogs.map(log => (
                                        <div
                                            key={log.id}
                                            className="bg-card space-y-3 rounded-lg border p-4"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <UserIcon className="text-muted-foreground h-4 w-4" />
                                                    <span className="text-sm font-medium">
                                                        {log.user.name}
                                                    </span>
                                                </div>
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                                        log.action.includes(
                                                            "created"
                                                        ) &&
                                                            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                                                        log.action.includes(
                                                            "updated"
                                                        ) &&
                                                            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                                                        log.action.includes(
                                                            "deleted"
                                                        ) &&
                                                            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                                                        log.action.includes(
                                                            "login"
                                                        ) &&
                                                            "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
                                                        log.action.includes(
                                                            "logout"
                                                        ) &&
                                                            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                    )}
                                                >
                                                    {formatAction(log.action)}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2 text-sm">
                                                {(log.target_type ||
                                                    log.target_slug) && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            Resource:
                                                        </span>
                                                        <span>
                                                            {log.target_type ||
                                                                "N/A"}{" "}
                                                            (
                                                            {log.target_slug ||
                                                                "N/A"}
                                                            )
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Time:
                                                    </span>
                                                    <span>
                                                        {formatTimestamp(
                                                            log.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        IP:
                                                    </span>
                                                    <span>
                                                        {log.ip_address ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                                {log.changes &&
                                                    Object.keys(log.changes)
                                                        .length > 0 && (
                                                        <div className="mt-2 border-t pt-2">
                                                            <span className="text-muted-foreground text-xs">
                                                                Changes:
                                                            </span>
                                                            <div className="mt-1 space-y-1">
                                                                {Object.entries(
                                                                    log.changes
                                                                )
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        ([
                                                                            key,
                                                                            value,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    key
                                                                                }
                                                                                className="text-muted-foreground text-xs"
                                                                            >
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        key
                                                                                    }
                                                                                    :
                                                                                </span>{" "}
                                                                                {typeof value ===
                                                                                "object"
                                                                                    ? JSON.stringify(
                                                                                          value
                                                                                      )
                                                                                    : String(
                                                                                          value
                                                                                      )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
