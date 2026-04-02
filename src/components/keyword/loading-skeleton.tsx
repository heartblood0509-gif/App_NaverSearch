"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <Card className="shadow-lg border-0 ring-1 ring-border/50">
      <CardHeader>
        <Skeleton className="h-8 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
