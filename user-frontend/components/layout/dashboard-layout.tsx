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
import { Input } from "@/components/ui/input";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/providers";
import { cn } from "@/lib/utils";
import {
    BellIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    SearchIcon,
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container flex h-16 items-center px-4">
                    <div className="mr-4 flex">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden hover:bg-accent/50 transition-colors"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <MenuIcon className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <div className="mr-6 flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 shadow-md overflow-hidden">
                                <Image
                                    src="/images/logo/um_logo.webp"
                                    alt="User Management Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 object-contain"
                                    priority
                                />
                            </div>
                            <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                                {t("userManagement")}
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-1 text-sm font-medium md:flex">
                            {navigation
                                .filter(item => !item.adminOnly || user?.role === 'admin')
                                .map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative px-4 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50",
                                                isActive 
                                                    ? "bg-accent text-accent-foreground shadow-sm" 
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {t(item.translationKey)}
                                            {isActive && (
                                                <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-amber-400 rounded-full" />
                                            )}
                                        </Link>
                                    );
                                })}
                        </nav>
                    </div>

                    <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">

                        {/* Right side actions */}
                        <div className="flex items-center space-x-1">
                            <LanguageSwitch />
                            <ThemeToggle />
                            
                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 transition-colors">
                                <BellIcon className="h-4 w-4" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full border-2 border-background" />
                            </Button>

                            {/* User menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage 
                                                src={user?.profile_photo ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8001'}/storage/${user.profile_photo}` : undefined} 
                                                alt={user?.name} 
                                            />
                                            <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-semibold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 p-2" align="end" forceMount sideOffset={8}>
                                    <DropdownMenuLabel className="font-normal p-3 bg-muted/30 rounded-lg mb-2">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage 
                                                    src={user?.profile_photo ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8001'}/storage/${user.profile_photo}` : undefined} 
                                                    alt={user?.name} 
                                                />
                                                <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-semibold">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem className="cursor-pointer p-2 rounded-md" asChild>
                                        <Link href="/profile">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            {t("profile")}
                                        </Link>
                                    </DropdownMenuItem>
                                    {user?.role === 'admin' && (
                                        <DropdownMenuItem className="cursor-pointer p-2 rounded-md" asChild>
                                            <Link href="/settings">
                                                <SettingsIcon className="mr-2 h-4 w-4" />
                                                {t("settings")}
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem 
                                        onClick={logout} 
                                        className="cursor-pointer p-2 rounded-md text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
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
                        "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r bg-background/95 backdrop-blur transition-transform supports-[backdrop-filter]:bg-background/60 md:sticky md:block",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    )}
                >
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <div className="space-y-1">
                                <nav className="grid items-start gap-2">
                                    {navigation
                                        .filter(item => !item.adminOnly || user?.role === 'admin')
                                        .map(item => {
                                            const Icon = item.icon;
                                            const isActive = pathname === item.href;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                                        isActive ? "bg-accent text-accent-foreground shadow-sm" : "transparent"
                                                    )}
                                                    onClick={() => setSidebarOpen(false)}
                                                >
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    <span>{t(item.translationKey)}</span>
                                                    {isActive && (
                                                        <div className="ml-auto h-1.5 w-1.5 bg-amber-400 rounded-full" />
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
                <main className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
