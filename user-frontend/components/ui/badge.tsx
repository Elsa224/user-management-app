import { cn } from "@/lib/utils";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
                {
                    "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow":
                        variant === "default",
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent":
                        variant === "secondary",
                    "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow":
                        variant === "destructive",
                    "text-foreground": variant === "outline",
                    "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-300":
                        variant === "success",
                },
                className
            )}
            {...props}
        />
    );
}

export { Badge };
