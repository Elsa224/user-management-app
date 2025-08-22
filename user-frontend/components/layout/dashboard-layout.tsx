"use client";

import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { useAuth } from "@/lib/providers";
import { cn } from "@/lib/utils";
import {
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    SettingsIcon,
    UsersIcon,
    XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
        translationKey: "dashboard",
    },
    {
        name: "Users",
        href: "/users",
        icon: UsersIcon,
        translationKey: "users",
    },
    {
        name: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        translationKey: "settings",
    },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const t = useTranslations("navigation");

    return (
        <div className="bg-background min-h-screen">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-black/50" />
                </div>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "bg-card fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b px-6">
                        <div className="flex items-center">
                            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                <span className="text-primary-foreground text-sm font-bold">
                                    UM
                                </span>
                            </div>
                            <span className="ml-2 text-lg font-semibold">
                                User Management
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XIcon className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navigation.map(item => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {t(item.translationKey)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info and logout */}
                    <div className="border-t p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                    <span className="text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <LanguageSwitch />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur lg:hidden">
                    <div className="flex h-16 items-center justify-between px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitch />
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOutIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
