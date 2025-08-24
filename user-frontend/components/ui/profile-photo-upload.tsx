"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";
import { useAuth } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { CameraIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
    profilePhotoUrl?: string | null;
    onPhotoChange?: (photoUrl: string | null) => void;
}

export function ProfilePhotoUpload({
    profilePhotoUrl,
    onPhotoChange,
}: ProfilePhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const t = useTranslations("profile");

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|webp|jpg|png|gif)$/)) {
            toast.error(
                "Please select a valid image file (JPG, WEB, PNG, or GIF)"
            );
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        uploadPhoto(file);
    };

    const uploadPhoto = async (file: File) => {
        setIsUploading(true);

        try {
            const response = await profileApi.uploadProfilePhoto(file);

            if (response.success && response.data) {
                toast.success(t("photoUploadSuccess"));
                onPhotoChange?.(response?.data.profile_photo_url);
            } else {
                toast.error(response.message || t("photoUploadError"));
            }
        } catch (error) {
            console.error("Photo upload error:", error);
            toast.error(t("photoUploadError"));
        } finally {
            setIsUploading(false);
        }
    };

    const deletePhoto = async () => {
        setIsUploading(true);

        try {
            const response = await profileApi.deleteProfilePhoto();

            if (response.success) {
                toast.success(t("photoDeleteSuccess"));
                onPhotoChange?.(null);
            } else {
                toast.error(response.message || t("photoDeleteError"));
            }
        } catch (error) {
            console.error("Photo delete error:", error);
            toast.error(t("photoDeleteError"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div className="space-y-4">
            {/* Mobile-first responsive layout */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
                {/* Profile Photo Preview */}
                <div className="relative flex-shrink-0">
                    <Avatar className="ring-background h-20 w-20 shadow-lg ring-4 sm:h-24 sm:w-24">
                        <AvatarImage
                            src={profilePhotoUrl || undefined}
                            alt={user?.name || "Profile"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-xl font-semibold text-white sm:text-2xl">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Upload overlay button */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="border-background absolute -right-2 -bottom-2 h-7 w-7 rounded-full border-2 shadow-lg sm:h-8 sm:w-8"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <CameraIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>

                {/* Upload Area */}
                <div className="w-full flex-1">
                    <div
                        className={cn(
                            "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:p-6",
                            isDragging
                                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/10"
                                : "border-muted-foreground/25 hover:bg-accent/50 hover:border-amber-400",
                            isUploading && "cursor-not-allowed opacity-50"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                            !isUploading && fileInputRef.current?.click()
                        }
                    >
                        <UploadIcon className="text-muted-foreground mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8" />
                        <p className="text-foreground mb-1 text-xs font-medium sm:text-sm">
                            {t("dragDropPhoto")}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {t("photoRequirements")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons - Mobile responsive */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1"
                >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">
                        {profilePhotoUrl ? t("changePhoto") : t("uploadPhoto")}
                    </span>
                </Button>

                {profilePhotoUrl && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={deletePhoto}
                        disabled={isUploading}
                        className="text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 sm:flex-shrink-0"
                    >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        <span className="truncate">{t("removePhoto")}</span>
                    </Button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => handleFileSelect(e.target.files)}
                className="hidden"
            />
        </div>
    );
}
