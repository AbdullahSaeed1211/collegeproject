"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Brain, Target, Activity, Zap, Trophy, Award } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useCognitiveScores } from "@/components/cognitive-score-card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface DomainProgress {
  domain: string;
  score: number;
  previousScore: number | null;
  change: number | null;
  icon: React.ReactNode;
}

const DOMAIN_COLORS: Record<string, string> = {
  memory: "bg-blue-500",
  attention: "bg-purple-500",
  processing: "bg-orange-500",
  executive: "bg-green-500",
  language: "bg-pink-500",
  overall: "bg-indigo-500",
};

export function ProgressTracker() {
  const { results: gameResults, isLoading: isGamesLoading } = useGameResults();
  const { cognitiveScores, isLoading: isScoresLoading } = useCognitiveScores();

  const getDomainProgress = (): DomainProgress[] => {
    if (cognitiveScores.length === 0) {
      return [
        { domain: "Memory", score: 0, previousScore: null, change: null, icon: <Brain className="h-5 w-5" /> },
        { domain: "Attention", score: 0, previousScore: null, change: null, icon: <Target className="h-5 w-5" /> },
        { domain: "Processing", score: 0, previousScore: null, change: null, icon: <Zap className="h-5 w-5" /> },
        { domain: "Executive", score: 0, previousScore: null, change: null, icon: <Activity className="h-5 w-5" /> },
      ];
    }

    return cognitiveScores.map((score) => ({
      domain: score.domain.charAt(0).toUpperCase() + score.domain.slice(1),
      score: score.score,
      previousScore: score.previousScore,
      change: score.previousScore ? score.score - score.previousScore : null,
      icon: <Brain className="h-5 w-5" />,
    }));
  };

  const domainProgress = getDomainProgress();
  const overallScore = domainProgress.length > 0 
    ? Math.round(domainProgress.reduce((sum, d) => sum + d.score, 0) / domainProgress.length)
    : 0;

  const totalGamesPlayed = gameResults.length;
  const totalScore = gameResults.reduce((sum, r) => sum + (r.score || 0), 0);
  const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0;

  const getChangeIcon = (change: number | null) => {
    if (change === null) return <Minus className="h-4 w-4" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4" />;
  };

  const getChangeColor = (change: number | null) => {
    if (change === null) return "text-muted-foreground";
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  if (isScoresLoading || isGamesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const hasData = totalGamesPlayed > 0 || cognitiveScores.length > 0;

  if (!hasData) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Progress Data Yet</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Complete cognitive games and assessments to track your progress here.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link href="/cognitive-games">Play Games</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/assessment-report">Take Assessment</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</p>
                <p className="text-xs text-muted-foreground">{getScoreLabel(overallScore)}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Games Played</p>
                <p className="text-3xl font-bold">{totalGamesPlayed}</p>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold">{totalScore.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-3xl font-bold">{averageScore}</p>
                <p className="text-xs text-muted-foreground">Per game</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Cognitive Domains</TabsTrigger>
          <TabsTrigger value="games">Game History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domainProgress.map((domain) => (
              <Card key={domain.domain}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded">
                        {domain.icon}
                      </div>
                      <CardTitle className="text-lg">{domain.domain}</CardTitle>
                    </div>
                    {getChangeIcon(domain.change)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl font-bold ${getScoreColor(domain.score)}`}>
                        {domain.score}
                      </span>
                      {domain.change !== null && (
                        <span className={`text-sm font-medium ${getChangeColor(domain.change)}`}>
                          {domain.change > 0 ? "+" : ""}{domain.change} from last
                        </span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${DOMAIN_COLORS[domain.domain.toLowerCase()] || "bg-primary"}`}
                        style={{ width: `${domain.score}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Game Sessions</CardTitle>
              <CardDescription>Your latest game performance</CardDescription>
            </CardHeader>
            <CardContent>
              {gameResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No games played yet</p>
              ) : (
                <div className="space-y-3">
                  {gameResults.slice(0, 10).map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {game.gameType?.replace(/-/g, ' ') || 'Game'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(game.completedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{game.score}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>How your scores are changing over time</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Play more games to see your performance trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
