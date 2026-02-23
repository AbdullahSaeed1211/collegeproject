"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Clock, Check, Trophy, Target, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  gameType: string;
  link: string;
  difficulty: "easy" | "medium" | "hard";
  icon: React.ReactNode;
  isCompleted: boolean;
  bonusPoints?: number;
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Memory Master",
    description: "Complete 3 Memory games",
    points: 50,
    gameType: "memory",
    link: "/cognitive-games",
    difficulty: "easy",
    icon: <Brain className="h-5 w-5" />,
    isCompleted: false,
  },
  {
    id: "2",
    title: "Speed Demon",
    description: "Get a reaction time under 300ms",
    points: 75,
    gameType: "reaction",
    link: "/cognitive-games",
    difficulty: "medium",
    icon: <Zap className="h-5 w-5" />,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Math Whiz",
    description: "Score 100+ points in Math Challenge",
    points: 60,
    gameType: "math-challenge",
    link: "/cognitive-games",
    difficulty: "medium",
    icon: <Target className="h-5 w-5" />,
    isCompleted: false,
  },
];

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function DailyChallenges() {
  const [challenges] = useState<Challenge[]>(DAILY_CHALLENGES);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.isCompleted ? c.points : 0), 0);
  const progressPercent = (completedCount / challenges.length) * 100;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Daily Challenges
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">points earned</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>{completedCount}/{challenges.length} completed</span>
            <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              challenge.isCompleted
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                challenge.isCompleted ? "bg-green-500 text-white" : "bg-primary/10 text-primary"
              }`}>
                {challenge.isCompleted ? <Check className="h-4 w-4" /> : challenge.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{challenge.title}</p>
                <p className="text-xs text-muted-foreground">{challenge.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={DIFFICULTY_COLORS[challenge.difficulty]}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {challenge.points}
              </Badge>
              {!challenge.isCompleted && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={challenge.link}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}

        {completedCount === challenges.length && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border border-yellow-200 dark:border-yellow-800 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="font-semibold text-orange-800 dark:text-orange-200">
              All challenges completed!
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-300">
              Come back tomorrow for new challenges
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DailyChallenge() {
  return <DailyChallenges />;
}
