"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, Zap, Clock, Target, Flame, Medal, 
  Crown, Award, Lock, Check
} from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementCategory {
  id: string;
  name: string;
  achievements: Achievement[];
}

const ACHIEVEMENTS_DATA: AchievementCategory[] = [
  {
    id: "games",
    name: "Game Master",
    achievements: [
      { id: "first_game", name: "First Steps", description: "Complete your first game", icon: <Star className="h-5 w-5" />, requirement: 1, progress: 0, unlocked: false, rarity: "common" },
      { id: "games_10", name: "Getting Started", description: "Play 10 games", icon: <Trophy className="h-5 w-5" />, requirement: 10, progress: 0, unlocked: false, rarity: "common" },
      { id: "games_50", name: "Regular Player", description: "Play 50 games", icon: <Medal className="h-5 w-5" />, requirement: 50, progress: 0, unlocked: false, rarity: "rare" },
      { id: "games_100", name: "Dedicated Trainer", description: "Play 100 games", icon: <Crown className="h-5 w-5" />, requirement: 100, progress: 0, unlocked: false, rarity: "epic" },
      { id: "games_500", name: "Brain Champion", description: "Play 500 games", icon: <Award className="h-5 w-5" />, requirement: 500, progress: 0, unlocked: false, rarity: "legendary" },
    ],
  },
  {
    id: "streak",
    name: "Streak Master",
    achievements: [
      { id: "streak_3", name: "On a Roll", description: "3 day streak", icon: <Flame className="h-5 w-5" />, requirement: 3, progress: 0, unlocked: false, rarity: "common" },
      { id: "streak_7", name: "Week Warrior", description: "7 day streak", icon: <Zap className="h-5 w-5" />, requirement: 7, progress: 0, unlocked: false, rarity: "rare" },
      { id: "streak_30", name: "Monthly Master", description: "30 day streak", icon: <Trophy className="h-5 w-5" />, requirement: 30, progress: 0, unlocked: false, rarity: "epic" },
      { id: "streak_100", name: "Unstoppable", description: "100 day streak", icon: <Crown className="h-5 w-5" />, requirement: 100, progress: 0, unlocked: false, rarity: "legendary" },
    ],
  },
  {
    id: "score",
    name: "High Scorer",
    achievements: [
      { id: "score_1000", name: "Point Getter", description: "Earn 1,000 points", icon: <Star className="h-5 w-5" />, requirement: 1000, progress: 0, unlocked: false, rarity: "common" },
      { id: "score_10000", name: "Score Master", description: "Earn 10,000 points", icon: <Medal className="h-5 w-5" />, requirement: 10000, progress: 0, unlocked: false, rarity: "rare" },
      { id: "score_50000", name: "Elite Scorer", description: "Earn 50,000 points", icon: <Award className="h-5 w-5" />, requirement: 50000, progress: 0, unlocked: false, rarity: "epic" },
      { id: "score_100000", name: "Legend", description: "Earn 100,000 points", icon: <Crown className="h-5 w-5" />, requirement: 100000, progress: 0, unlocked: false, rarity: "legendary" },
    ],
  },
  {
    id: "perfection",
    name: "Perfectionist",
    achievements: [
      { id: "perfect_game", name: "Perfect Game", description: "Get a perfect score", icon: <Star className="h-5 w-5" />, requirement: 1, progress: 0, unlocked: false, rarity: "rare" },
      { id: "speed_demon", name: "Speed Demon", description: "Complete a game in under 10 seconds", icon: <Clock className="h-5 w-5" />, requirement: 1, progress: 0, unlocked: false, rarity: "rare" },
      { id: "streak_10", name: "Perfect Streak", description: "10 correct answers in a row", icon: <Target className="h-5 w-5" />, requirement: 10, progress: 0, unlocked: false, rarity: "epic" },
    ],
  },
];

export function Achievements() {
  const [achievements, setAchievements] = useState<AchievementCategory[]>(ACHIEVEMENTS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { results: gameResults } = useGameResults();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const totalGames = gameResults.length;
    const totalScore = gameResults.reduce((sum, r) => sum + (r.score || 0), 0);
    const currentStreak = 3;

    setAchievements((prev) =>
      prev.map((category) => ({
        ...category,
        achievements: category.achievements.map((achievement) => {
          let progress = 0;
          let unlocked = false;

          switch (category.id) {
            case "games":
              progress = Math.min(totalGames, achievement.requirement);
              unlocked = totalGames >= achievement.requirement;
              break;
            case "streak":
              progress = Math.min(currentStreak, achievement.requirement);
              unlocked = currentStreak >= achievement.requirement;
              break;
            case "score":
              progress = Math.min(totalScore, achievement.requirement);
              unlocked = totalScore >= achievement.requirement;
              break;
            case "perfection":
              progress = 0;
              unlocked = false;
              break;
          }

          return { ...achievement, progress, unlocked };
        }),
      }))
    );
  }, [gameResults, isLoaded, userId]);

  const unlockedCount = achievements.reduce(
    (sum, cat) => sum + cat.achievements.filter((a) => a.unlocked).length,
    0
  );
  const totalCount = achievements.reduce(
    (sum, cat) => sum + cat.achievements.length,
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
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
              Achievements
            </CardTitle>
            <CardDescription>
              {unlockedCount} of {totalCount} unlocked
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </Badge>
        </div>
        <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((category) => (
          <div key={category.id} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`p-1.5 rounded ${
                        achievement.unlocked
                          ? "bg-primary/10"
                          : "bg-muted"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <div className="text-primary">
                          {achievement.icon}
                        </div>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}/{achievement.requirement}
                        </p>
                      )}
                      {achievement.unlocked && (
                        <Check className="h-3 w-3 text-green-500 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" asChild>
          <a href="/achievements">View All Achievements</a>
        </Button>
      </CardContent>
    </Card>
  );
}
