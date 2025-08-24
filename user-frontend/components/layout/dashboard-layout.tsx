"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-utils";
import {
    BellIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    SettingsIcon,
    UserIcon,
    UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
        adminOnly: true,
    },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const t = useTranslations("navigation");
    const authT = useTranslations("auth");

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur">
                <div className="container flex h-16 items-center px-4">
                    <div className="mr-4 flex">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent/50 transition-colors md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <MenuIcon className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <div className="mr-6 flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 shadow-md">
                                <Image
                                    src="/images/logo/um_logo.webp"
                                    alt="User Management Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 object-contain"
                                    priority
                                />
                            </div>
                            <span className="from-foreground to-foreground/80 hidden bg-gradient-to-r bg-clip-text text-base font-bold sm:inline-block sm:text-lg">
                                <span className="hidden sm:inline">{t("userManagement")}</span>
                                <span className="sm:hidden">UM</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-1 text-sm font-medium md:flex">
                            {navigation
                                .filter(
                                    item =>
                                        !item.adminOnly ||
                                        user?.role === "admin"
                                )
                                .map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "hover:bg-accent/50 relative rounded-lg px-4 py-2 transition-all duration-200",
                                                isActive
                                                    ? "bg-accent text-accent-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {t(item.translationKey)}
                                            {isActive && (
                                                <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-amber-400" />
                                            )}
                                        </Link>
                                    );
                                })}
                        </nav>
                    </div>

                    <div className="flex flex-1 items-center justify-end space-x-4 md:justify-end">
                        {/* Right side actions */}
                        <div className="flex items-center space-x-1">
                            <div className="hidden sm:flex sm:items-center sm:space-x-1">
                                <LanguageSwitch />
                                <ThemeToggle />

                                {/* Notifications */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-accent/50 relative transition-colors"
                                >
                                    <BellIcon className="h-4 w-4" />
                                    <span className="border-background absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 bg-amber-400" />
                                </Button>
                            </div>

                            {/* User menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-accent/50 relative h-10 w-10 rounded-full transition-colors"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={getImageUrl(user?.profile_photo)}
                                                alt={user?.name}
                                            />
                                            <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-sm font-semibold text-white">
                                                {user?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 p-2 sm:w-64"
                                    align="end"
                                    forceMount
                                    sideOffset={8}
                                >
                                    <DropdownMenuLabel className="bg-muted/30 mb-2 rounded-lg p-2 font-normal sm:p-3">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                <AvatarImage
                                                    src={getImageUrl(user?.profile_photo)}
                                                    alt={user?.name}
                                                />
                                                <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-xs font-semibold text-white sm:text-sm">
                                                    {user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex min-w-0 flex-1 flex-col space-y-1">
                                                <p className="truncate text-xs font-medium leading-none sm:text-sm">
                                                    {user?.name}
                                                </p>
                                                <p className="text-muted-foreground truncate text-xs leading-none">
                                                    {user?.email}
                                                </p>
                                                <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-2" />
                                    
                                    {/* Mobile-only theme and language controls */}
                                    <div className="mb-2 sm:hidden">
                                        <div className="flex items-center justify-between px-2 py-1">
                                            <div className="flex items-center space-x-1">
                                                <LanguageSwitch />
                                                <ThemeToggle />
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator className="my-2" />
                                    </div>
                                    
                                    <DropdownMenuItem
                                        className="cursor-pointer rounded-md p-2"
                                        asChild
                                    >
                                        <Link href="/profile">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            {t("profile")}
                                        </Link>
                                    </DropdownMenuItem>
                                    {user?.role === "admin" && (
                                        <DropdownMenuItem
                                            className="cursor-pointer rounded-md p-2"
                                            asChild
                                        >
                                            <Link href="/settings">
                                                <SettingsIcon className="mr-2 h-4 w-4" />
                                                {t("settings")}
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="cursor-pointer rounded-md p-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/10"
                                    >
                                        <LogOutIcon className="mr-2 h-4 w-4" />
                                        {authT("logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Mobile Sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 border-r backdrop-blur transition-transform md:sticky md:block",
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    )}
                >
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <div className="space-y-1">
                                <nav className="grid items-start gap-2">
                                    {navigation
                                        .filter(
                                            item =>
                                                !item.adminOnly ||
                                                user?.role === "admin"
                                        )
                                        .map(item => {
                                            const Icon = item.icon;
                                            const isActive =
                                                pathname === item.href;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                        isActive
                                                            ? "bg-accent text-accent-foreground shadow-sm"
                                                            : "transparent"
                                                    )}
                                                    onClick={() =>
                                                        setSidebarOpen(false)
                                                    }
                                                >
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    <span>
                                                        {t(item.translationKey)}
                                                    </span>
                                                    {isActive && (
                                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                </nav>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
            </div>
        </div>
    );
}
