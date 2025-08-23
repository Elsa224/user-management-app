"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { forwardRef } from "react";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    loading?: boolean;
    loadingText?: string;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    (
        {
            children,
            loading = false,
            loadingText,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <Button
                ref={ref}
                disabled={disabled || loading}
                className={cn(className)}
                {...props}
            >
                {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading && loadingText ? loadingText : children}
            </Button>
        );
    }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
