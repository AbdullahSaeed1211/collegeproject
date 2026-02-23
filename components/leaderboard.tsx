"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, User, Zap } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  totalScore: number;
  gamesPlayed: number;
  avgScore: number;
  streak: number;
  change: number;
}

export function Leaderboard() {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isLoaded } = useAuth();
  const { results: gameResults } = useGameResults();
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded || !userId || gameResults.length === 0) {
      setUserRank(null);
      return;
    }

    const totalScore = gameResults.reduce((sum, r) => sum + (r.score || 0), 0);
    const userEntry: LeaderboardEntry = {
      rank: 0,
      userId,
      name: "You",
      totalScore,
      gamesPlayed: gameResults.length,
      avgScore: Math.round(totalScore / gameResults.length),
      streak: 3,
      change: 0,
    };
    setUserRank(userEntry);
  }, [gameResults, userId, isLoaded]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
    if (rank === 2) return "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800";
    if (rank === 3) return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800";
    return "";
  };

  const filteredLeaderboard: LeaderboardEntry[] = [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers this {timeRange}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {(["weekly", "monthly", "alltime"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range === "alltime" ? "All Time" : range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {userRank && (
          <div className="p-3 rounded-lg border bg-primary/5 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Your Ranking</p>
                  <p className="text-sm text-muted-foreground">
                    {userRank.gamesPlayed} games • {userRank.totalScore.toLocaleString()} points
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg font-bold">
                {userRank ? `#${userRank.rank}` : '--'}
              </Badge>
            </div>
          </div>
        )}

        {filteredLeaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No leaderboard data yet</p>
            <p className="text-sm text-muted-foreground">Play games to appear on the leaderboard!</p>
          </div>
        ) : (
          filteredLeaderboard.map((entry: LeaderboardEntry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg border ${getRankBgColor(entry.rank)}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-semibold">
                  {entry.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{entry.gamesPlayed} games</span>
                    <span>•</span>
                    <span>Avg: {entry.avgScore}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.totalScore.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                  {entry.streak > 0 && (
                    <>
                      <Zap className="h-3 w-3 text-orange-500" />
                      <span>{entry.streak}</span>
                    </>
                  )}
                  {entry.change !== 0 && (
                    <span className={entry.change > 0 ? "text-green-500" : "text-red-500"}>
                      {entry.change > 0 ? "↑" : "↓"} {Math.abs(entry.change)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        <Button variant="ghost" className="w-full mt-2" asChild>
          <a href="/leaderboard">View Full Leaderboard</a>
        </Button>
      </CardContent>
    </Card>
  );
}
