"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface LoadingOverlayProps {
    isLoading: boolean;
    text?: string;
    className?: string;
    children?: React.ReactNode;
}

export function LoadingOverlay({
    isLoading,
    text = "Loading...",
    className,
    children,
}: LoadingOverlayProps) {
    if (!isLoading && !children) return null;

    return (
        <div className={cn("relative", className)}>
            {children}
            {isLoading && (
                <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-2">
                        <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
                        <p className="text-muted-foreground text-sm">{text}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
