"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Zap, CheckCircle, XCircle } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";

type Color = "red" | "blue" | "green" | "yellow" | "orange" | "purple";

const COLORS: Color[] = ["red", "blue", "green", "yellow", "orange", "purple"];

const COLOR_NAMES: Record<Color, string> = {
  red: "RED",
  blue: "BLUE",
  green: "GREEN",
  yellow: "YELLOW",
  orange: "ORANGE",
  purple: "PURPLE",
};

const COLOR_STYLES: Record<Color, string> = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  purple: "text-purple-500",
};

type GameMode = "congruent" | "incongruent" | "mixed";

export function StroopTest() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [currentWord, setCurrentWord] = useState<Color | null>(null);
  const [currentColor, setCurrentColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [problemsAnswered, setProblemsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Color | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("mixed");
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { saveResult } = useGameResults();
  const { toast } = useToast();

  const generateProblem = (mode: GameMode): { word: Color; color: Color } => {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    let color: Color;
    if (mode === "congruent") {
      color = word;
    } else if (mode === "incongruent") {
      const otherColors = COLORS.filter((c) => c !== word);
      color = otherColors[Math.floor(Math.random() * otherColors.length)];
    } else {
      color = Math.random() > 0.5 
        ? word 
        : COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    return { word, color };
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(30);
    setProblemsAnswered(0);
    
    const problem = generateProblem(gameMode);
    setCurrentWord(problem.word);
    setCurrentColor(problem.color);
    
    setGameState("playing");
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState("results");
    
    const accuracy = problemsAnswered > 0 ? Math.round((score / (problemsAnswered * 10)) * 100) : 0;
    
    saveResult({
      gameType: "stroop-test",
      score,
      level: gameMode === "congruent" ? 1 : gameMode === "incongruent" ? 3 : 2,
      duration: 30 - timeLeft,
      accuracy,
    });

    toast({
      title: "Test Complete!",
      description: `You scored ${score} points in 30 seconds!`,
      variant: "default",
    });
  };

  const handleAnswer = (answer: Color) => {
    if (!currentColor || selectedAnswer !== null || showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === currentColor;
    
    if (correct) {
      setScore((prev) => prev + 10 + (streak * 2));
      setStreak((prev) => prev + 1);
      setBestStreak((prev) => Math.max(prev, streak + 1));
      setIsCorrect(true);
    } else {
      setStreak(0);
      setIsCorrect(false);
    }

    setProblemsAnswered((prev) => prev + 1);
    setShowFeedback(true);

    setTimeout(() => {
      const problem = generateProblem(gameMode);
      setCurrentWord(problem.word);
      setCurrentColor(problem.color);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const accuracy = problemsAnswered > 0 ? Math.round((score / (problemsAnswered * 10)) * 100) : 0;

  if (gameState === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Stroop Test
          </CardTitle>
          <CardDescription>
            Name the color of the ink, not the word! This tests your ability to manage conflicting information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Game Mode</label>
            <div className="flex flex-wrap gap-2">
              {([
                { mode: "congruent" as const, label: "Easy (Match)" },
                { mode: "incongruent" as const, label: "Hard (Conflict)" },
                { mode: "mixed" as const, label: "Mixed" },
              ]).map(({ mode, label }) => (
                <Button
                  key={mode}
                  variant={gameMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGameMode(mode)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">Instructions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>If you see <span className="text-red-500 font-bold">RED</span> in red ink: tap RED</li>
              <li>If you see <span className="text-blue-500 font-bold">RED</span> in blue ink: tap BLUE</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startGame} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (gameState === "results") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Great cognitive control!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{problemsAnswered}</p>
              <p className="text-sm text-muted-foreground">Answered</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{bestStreak}</p>
              <p className="text-sm text-muted-foreground">Best Streak</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={() => setGameState("idle")} className="flex-1">
            Change Mode
          </Button>
          <Button onClick={startGame} className="flex-1">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Stroop Test</CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeLeft <= 5 ? "text-red-500 font-bold" : ""}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>{streak}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">What color is the ink?</p>
          <p className="text-5xl font-bold">
            {currentWord && (
              <span className={currentColor ? COLOR_STYLES[currentColor] : ""}>
                {COLOR_NAMES[currentWord || "red"]}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((color) => (
            <Button
              key={color}
              variant={
                selectedAnswer === color
                  ? color === currentColor
                    ? "default"
                    : "destructive"
                  : "outline"
              }
              onClick={() => handleAnswer(color)}
              disabled={selectedAnswer !== null}
              className={COLOR_STYLES[color]}
            >
              {COLOR_NAMES[color]}
            </Button>
          ))}
        </div>

        {showFeedback && selectedAnswer !== null && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isCorrect ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
          }`}>
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
              {isCorrect ? "Correct!" : `The ink was ${COLOR_NAMES[currentColor || "red"]}`}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Score: {score}</span>
          <span>Answered: {problemsAnswered}</span>
        </div>
      </CardContent>
    </Card>
  );
}
