"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentUsersSkeleton() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-64" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="ml-4 space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <div className="ml-auto space-y-1 text-right">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}