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
            toast.error("Please select a valid image file (JPG, WEB, PNG, or GIF)");
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
            <div className="flex items-center space-x-6">
                {/* Profile Photo Preview */}
                <div className="relative">
                    <Avatar className="ring-background h-24 w-24 shadow-lg ring-4">
                        <AvatarImage
                            src={profilePhotoUrl || undefined}
                            alt={user?.name || "Profile"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-2xl font-semibold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Upload overlay button */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="border-background absolute -right-2 -bottom-2 h-8 w-8 rounded-full border-2 shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <CameraIcon className="h-4 w-4" />
                    </Button>
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                    <div
                        className={cn(
                            "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
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
                        <UploadIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                        <p className="text-foreground mb-1 text-sm font-medium">
                            {t("dragDropPhoto")}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {t("photoRequirements")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1"
                >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    {profilePhotoUrl ? t("changePhoto") : t("uploadPhoto")}
                </Button>

                {profilePhotoUrl && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={deletePhoto}
                        disabled={isUploading}
                        className="text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10"
                    >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        {t("removePhoto")}
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
