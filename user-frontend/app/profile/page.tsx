"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProfilePhotoUpload } from "@/components/ui/profile-photo-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { profileApi, usersApi } from "@/lib/api";
import { useAuth } from "@/lib/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["admin", "user"]).optional(),
});

const passwordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required"),
        password: z
            .string()
            .min(6, "New password must be at least 6 characters"),
        password_confirmation: z
            .string()
            .min(6, "Password confirmation is required"),
    })
    .refine(data => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ["password_confirmation"],
    });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const { user, refreshUser } = useAuth();
    const t = useTranslations("profile");
    const commonT = useTranslations("common");
    const formsT = useTranslations("forms");

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        setValue: setProfileValue,
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    // Load user profile using React Query
    const { data: profileResponse } = useQuery({
        queryKey: ["profile"],
        queryFn: () => profileApi.getProfile(),
        enabled: !!user,
    });

    // Update form values when profile data is loaded
    useEffect(() => {
        if (profileResponse?.data) {
            const profile = profileResponse.data;
            setProfileValue("name", profile.name);
            setProfileValue("email", profile.email);
            setProfileValue("role", profile.role);
            setProfilePhotoUrl(profile.profile_photo_url || null);
        }
    }, [profileResponse?.data, setProfileValue]);

    const onSubmitProfile = async (data: ProfileForm) => {
        setIsUpdatingProfile(true);

        try {
            const response = await usersApi.updateUser(user!.slug, data);

            if (response.success) {
                toast.success(t("profileUpdateSuccess"));
                await refreshUser();
            } else {
                toast.error(response.message || t("profileUpdateError"));
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(t("profileUpdateError"));
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const onSubmitPassword = async (data: PasswordForm) => {
        setIsChangingPassword(true);

        try {
            const response = await profileApi.changePassword(
                data.current_password,
                data.password,
                data.password_confirmation
            );

            if (response.success) {
                toast.success(t("passwordChangeSuccess"));
                resetPasswordForm();
            } else {
                toast.error(response.message || t("passwordChangeError"));
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error(t("passwordChangeError"));
        } finally {
            setIsChangingPassword(false);
        }
    };

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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Profile Photo Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card text-card-foreground rounded-lg border p-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {t("profilePhoto")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("changePhoto")}
                                    </p>
                                </div>
                                <ProfilePhotoUpload
                                    profilePhotoUrl={profilePhotoUrl}
                                    onPhotoChange={setProfilePhotoUrl}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Personal Information Card */}
                        <div className="bg-card text-card-foreground rounded-lg border p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {t("personalInfo")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("updatePersonalDetails")}
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmitProfile(
                                        onSubmitProfile
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                {commonT("name")}
                                            </Label>
                                            <Input
                                                id="name"
                                                {...registerProfile("name")}
                                                className={
                                                    profileErrors.name
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            {profileErrors.name && (
                                                <p className="text-destructive text-sm">
                                                    {profileErrors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                {commonT("email")}
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...registerProfile("email")}
                                                className={
                                                    profileErrors.email
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            {profileErrors.email && (
                                                <p className="text-destructive text-sm">
                                                    {
                                                        profileErrors.email
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {user?.role === "admin" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="role">
                                                {commonT("role")}
                                            </Label>
                                            <Select
                                                onValueChange={value =>
                                                    setProfileValue(
                                                        "role",
                                                        value as
                                                            | "admin"
                                                            | "user"
                                                    )
                                                }
                                                defaultValue={user.role}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">
                                                        {commonT("admin")}
                                                    </SelectItem>
                                                    <SelectItem value="user">
                                                        {commonT("user")}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <LoadingButton
                                            type="submit"
                                            loading={isUpdatingProfile}
                                            loadingText={commonT("updating")}
                                        >
                                            {t("updateProfile")}
                                        </LoadingButton>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Account Security Card */}
                        <div className="bg-card text-card-foreground rounded-lg border p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {t("accountSecurity")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("updatePasswordDescription")}
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmitPassword(
                                        onSubmitPassword
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">
                                            {t("currentPassword")}
                                        </Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            {...registerPassword(
                                                "current_password"
                                            )}
                                            className={
                                                passwordErrors.current_password
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                        {passwordErrors.current_password && (
                                            <p className="text-destructive text-sm">
                                                {
                                                    passwordErrors
                                                        .current_password
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                {t("newPassword")}
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                {...registerPassword(
                                                    "password"
                                                )}
                                                className={
                                                    passwordErrors.password
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            {passwordErrors.password && (
                                                <p className="text-destructive text-sm">
                                                    {
                                                        passwordErrors.password
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                {t("confirmNewPassword")}
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                {...registerPassword(
                                                    "password_confirmation"
                                                )}
                                                className={
                                                    passwordErrors.password_confirmation
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            {passwordErrors.password_confirmation && (
                                                <p className="text-destructive text-sm">
                                                    {
                                                        passwordErrors
                                                            .password_confirmation
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <LoadingButton
                                            type="submit"
                                            loading={isChangingPassword}
                                            loadingText={commonT("updating")}
                                        >
                                            {t("changePassword")}
                                        </LoadingButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
