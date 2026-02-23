export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Brain, Clock, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboard | Care4Brain",
  description: "See how you rank against other brain training enthusiasts",
};

const GAME_CATEGORIES = [
  { id: "all", label: "All Games", icon: Trophy },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "reaction", label: "Reaction", icon: Clock },
  { id: "math-challenge", label: "Math", icon: Target },
  { id: "stroop-test", label: "Stroop", icon: Zap },
];

export default function LeaderboardPage() {
  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Compete with others and see how you rank in brain training
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Weekly rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <Leaderboard />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Games Played</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Points</span>
                  <span className="font-bold">4,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-bold flex items-center gap-1">
                    3 <Zap className="h-4 w-4 text-orange-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Best Rank</span>
                  <Badge variant="secondary">#42</Badge>
                </div>
                <Button className="w-full" asChild>
                  <a href="/cognitive-games">Play to Improve</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {GAME_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={`/leaderboard?game=${cat.id}`}>
                      <cat.icon className="mr-2 h-4 w-4" />
                      {cat.label}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How Rankings Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded h-fit">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Total Score</p>
                  <p className="text-sm">Points from all games accumulate toward your ranking</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded h-fit">
                  <Zap className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Streak Bonus</p>
                  <p className="text-sm">Playing daily gives you a streak that boosts visibility</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded h-fit">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Consistency</p>
                  <p className="text-sm">Regular players rank higher than occasional players</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
