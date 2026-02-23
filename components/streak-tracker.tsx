"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, Trophy, Gift, Star, Zap, Clock, Target, 
  CheckCircle, XCircle, Lock
} from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastPlayedDate: string | null;
  weeklyGoal: number;
  weeklyProgress: number;
  streakHistory: { date: string; played: boolean }[];
  rewards: Reward[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  icon: React.ReactNode;
}

const REWARDS: Reward[] = [
  { id: "streak_3", name: "First Spark", description: "3 day streak", requirement: 3, unlocked: false, icon: <Flame className="h-5 w-5" /> },
  { id: "streak_7", name: "Week Warrior", description: "7 day streak", requirement: 7, unlocked: false, icon: <Flame className="h-5 w-5" /> },
  { id: "streak_14", name: "Two Week Titan", description: "14 day streak", requirement: 14, unlocked: false, icon: <Flame className="h-5 w-5" /> },
  { id: "streak_30", name: "Monthly Master", description: "30 day streak", requirement: 30, unlocked: false, icon: <Trophy className="h-5 w-5" /> },
  { id: "streak_60", name: "Unstoppable", description: "60 day streak", requirement: 60, unlocked: false, icon: <Star className="h-5 w-5" /> },
  { id: "streak_100", name: "Century Club", description: "100 day streak", requirement: 100, unlocked: false, icon: <Gift className="h-5 w-5" /> },
  { id: "games_50", name: "Dedicated", description: "Play 50 games", requirement: 50, unlocked: false, icon: <Target className="h-5 w-5" /> },
  { id: "games_100", name: "Committed", description: "Play 100 games", requirement: 100, unlocked: false, icon: <Target className="h-5 w-5" /> },
  { id: "games_500", name: "Brain Machine", description: "Play 500 games", requirement: 500, unlocked: false, icon: <Zap className="h-5 w-5" /> },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { results: gameResults } = useGameResults();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setStreakData(null);
      return;
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const weekDays: { date: string; played: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      weekDays.push({
        date: dateStr,
        played: false,
      });
    }

    const currentStreak = 0;
    const totalGames = gameResults.length;

    const rewards = REWARDS.map((reward) => {
      let unlocked = false;
      if (reward.id.startsWith("streak_")) {
        unlocked = currentStreak >= reward.requirement;
      } else if (reward.id.startsWith("games_")) {
        unlocked = totalGames >= reward.requirement;
      }
      return { ...reward, unlocked };
    });

    setStreakData({
      currentStreak,
      longestStreak: 0,
      totalActiveDays: totalGames,
      lastPlayedDate: gameResults.length > 0 ? new Date(gameResults[0].completedAt).toISOString().split("T")[0] : null,
      weeklyGoal: 5,
      weeklyProgress: 0,
      streakHistory: weekDays,
      rewards,
    });
  }, [gameResults, userId, isLoaded]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-16" />
        </CardContent>
      </Card>
    );
  }

  if (!streakData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Flame className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Start Your Streak</h3>
          <p className="text-muted-foreground text-sm">
            Sign in to track your daily streak and earn rewards
          </p>
        </CardContent>
      </Card>
    );
  }

  const weeklyProgressPercent = (streakData.weeklyProgress / streakData.weeklyGoal) * 100;
  const unlockedRewards = streakData.rewards.filter((r) => r.unlocked).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Your Streak
            </CardTitle>
            <CardDescription>Keep playing daily to build your streak</CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            🔥 {streakData.currentStreak} days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak Display */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 ${
              streakData.currentStreak >= 7 
                ? "bg-gradient-to-br from-orange-400 to-red-500" 
                : "bg-orange-100 dark:bg-orange-900"
            }`}>
              <span className={`text-4xl font-bold ${
                streakData.currentStreak >= 7 ? "text-white" : "text-orange-600 dark:text-orange-400"
              }`}>
                {streakData.currentStreak}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">day streak</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weekly Goal</span>
            <span className="font-medium">{streakData.weeklyProgress}/{streakData.weeklyGoal} days</span>
          </div>
          <Progress value={weeklyProgressPercent} className="h-2" />
          {streakData.weeklyProgress >= streakData.weeklyGoal && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Weekly goal completed!
            </p>
          )}
        </div>

        {/* Week Calendar */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">This Week</p>
          <div className="flex justify-between gap-1">
            {streakData.streakHistory.map((day, index) => {
              const date = new Date(day.date);
              const isToday = index === 6;
              const isPast = index < 6 && !day.played;
              
              return (
                <div key={day.date} className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    {DAYS_OF_WEEK[index]}
                  </p>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-medium ${
                      day.played 
                        ? "bg-green-500 text-white" 
                        : isToday 
                          ? "bg-primary text-white"
                          : isPast
                            ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-400"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day.played ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isToday ? (
                      <Clock className="h-4 w-4" />
                    ) : isPast ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      date.getDate()
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{streakData.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{streakData.totalActiveDays}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{unlockedRewards}/{streakData.rewards.length}</p>
            <p className="text-xs text-muted-foreground">Rewards</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreakRewards() {
  const [rewards, setRewards] = useState<Reward[]>(REWARDS);
  const [isLoading, setIsLoading] = useState(true);
  const { results: gameResults } = useGameResults();
  const { isLoaded } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const currentStreak = 5;
    const totalGames = gameResults.length;

    setRewards(REWARDS.map((reward) => {
      let unlocked = false;
      if (reward.id.startsWith("streak_")) {
        unlocked = currentStreak >= reward.requirement;
      } else if (reward.id.startsWith("games_")) {
        unlocked = totalGames >= reward.requirement;
      }
      return { ...reward, unlocked };
    }));
  }, [gameResults, isLoaded]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const streakRewards = rewards.filter((r) => r.id.startsWith("streak_"));
  const gameRewards = rewards.filter((r) => r.id.startsWith("games_"));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-500" />
          Rewards
        </CardTitle>
        <CardDescription>Unlock rewards by maintaining streaks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Streak Rewards</h4>
          <div className="grid grid-cols-2 gap-2">
            {streakRewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-3 rounded-lg border ${
                  reward.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {reward.unlocked ? (
                    <div className="text-yellow-500">{reward.icon}</div>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-sm">{reward.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Game Rewards</h4>
          <div className="grid grid-cols-2 gap-2">
            {gameRewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-3 rounded-lg border ${
                  reward.unlocked
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-800"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {reward.unlocked ? (
                    <div className="text-purple-500">{reward.icon}</div>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-sm">{reward.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
