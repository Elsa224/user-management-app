"use client";

import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: "default" | "destructive" | "warning" | "info";
    loading?: boolean;
}

const variantConfig = {
    default: {
        icon: InfoIcon,
        iconColor: "text-blue-600 dark:text-blue-400",
        confirmVariant: "default" as const,
    },
    destructive: {
        icon: XCircleIcon,
        iconColor: "text-red-600 dark:text-red-400",
        confirmVariant: "destructive" as const,
    },
    warning: {
        icon: AlertTriangleIcon,
        iconColor: "text-amber-600 dark:text-amber-400",
        confirmVariant: "default" as const,
    },
    info: {
        icon: CheckCircleIcon,
        iconColor: "text-green-600 dark:text-green-400",
        confirmVariant: "default" as const,
    },
};

export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "default",
    loading = false,
}: AlertDialogProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" onEscapeKeyDown={handleCancel}>
                <DialogHeader>
                    <div className="flex items-center space-x-3">
                        <div className={cn(
                            "flex-shrink-0 rounded-full p-2",
                            variant === "destructive" && "bg-red-100 dark:bg-red-900/20",
                            variant === "warning" && "bg-amber-100 dark:bg-amber-900/20",
                            variant === "info" && "bg-green-100 dark:bg-green-900/20",
                            variant === "default" && "bg-blue-100 dark:bg-blue-900/20"
                        )}>
                            <Icon className={cn("h-5 w-5", config.iconColor)} />
                        </div>
                        <DialogTitle className="text-left">{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <DialogDescription className="text-left leading-relaxed">
                    {description}
                </DialogDescription>
                <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={config.confirmVariant}
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto"
                        autoFocus
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}