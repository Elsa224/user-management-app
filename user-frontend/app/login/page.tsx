"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const t = useTranslations("auth");
    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError("");

        try {
            await login(data.email, data.password);
            toast.success(t("loginSuccess"));
            router.push("/dashboard");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || t("invalidCredentials");
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left side - Image/Branding */}
            <div className="relative hidden bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 lg:block">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex h-full flex-col justify-center p-8 text-white">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold">
                            {t("systemTitle")}
                        </h1>
                        <p className="text-xl text-amber-100">
                            {t("systemDescription")}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-white" />
                                <span>{t("features.secureAuth")}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-white" />
                                <span>{t("features.roleBasedAccess")}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-white" />
                                <span>{t("features.realtimeManagement")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mb-8 flex justify-end space-x-2">
                        <LanguageSwitch />
                        <ThemeToggle />
                    </div>

                    <h2 className="text-foreground text-center text-3xl font-bold tracking-tight">
                        {t("welcome")}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-center text-sm">
                        {t("loginSubtitle")}
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-background rounded-lg border px-4 py-8 shadow-lg sm:px-10">
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {error && (
                                <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-foreground block text-sm font-medium"
                                >
                                    {t("email")}
                                </Label>
                                <div className="mt-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="john@example.com"
                                        {...register("email")}
                                        className={
                                            errors.email
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-destructive mt-1 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-foreground block text-sm font-medium"
                                >
                                    {t("password")}
                                </Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={
                                            errors.password
                                                ? "border-destructive pr-10"
                                                : "pr-10"
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="text-muted-foreground h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="text-muted-foreground h-4 w-4" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="text-destructive mt-1 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <LoadingButton
                                    type="submit"
                                    className="w-full"
                                    loading={isLoading}
                                    loadingText={t("loading")}
                                >
                                    {t("signIn")}
                                </LoadingButton>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="text-muted-foreground text-center text-sm">
                                {t("demoCredentials")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
