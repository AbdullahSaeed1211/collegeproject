"use client";

import { Activity, Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useGameResults } from "@/hooks/use-game-results";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function RecentActivity() {
  const { results: gameResults, isLoading } = useGameResults();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest brain health activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">No activity yet</p>
            <p className="text-sm text-muted-foreground">
              <Link href="/cognitive-games" className="text-primary hover:underline">Play some games</Link> to see your activity here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = gameResults.slice(0, 5).map((result) => ({
    id: result.id,
    title: `Played ${result.gameType?.replace(/-/g, ' ') || 'Game'}`,
    icon: <Brain className="h-4 w-4 text-primary" />,
    date: new Date(result.completedAt)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest brain health activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start space-x-4 ${
                index < activities.length - 1 ? "border-b pb-4" : ""
              }`}
            >
              <div className="rounded-full bg-primary/10 p-2">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium capitalize">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
