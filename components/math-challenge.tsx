"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Zap, CheckCircle, XCircle } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";

type Problem = {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
  options: number[];
};

export function MathChallenge() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [problemsAnswered, setProblemsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { saveResult } = useGameResults();
  const { toast } = useToast();

  const generateProblem = (diff: "easy" | "medium" | "hard"): Problem => {
    let num1: number, num2: number, operator: string, answer: number;
    
    switch (diff) {
      case "easy":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.5 ? "+" : "-";
        answer = operator === "+" ? num1 + num2 : num1 - num2;
        break;
      case "medium":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        const ops = ["+", "-", "×"];
        operator = ops[Math.floor(Math.random() * ops.length)];
        if (operator === "×") {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = num1 * num2;
        } else {
          answer = operator === "+" ? num1 + num2 : num1 - num2;
        }
        break;
      case "hard":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        const hardOps = ["+", "-", "×"];
        operator = hardOps[Math.floor(Math.random() * hardOps.length)];
        if (operator === "×") {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
        } else {
          answer = operator === "+" ? num1 + num2 : num1 - num2;
        }
        break;
    }

    const options = generateOptions(answer, diff);
    return { num1, num2, operator, answer, options };
  };

  const generateOptions = (correct: number, diff: "easy" | "medium" | "hard"): number[] => {
    const options = new Set<number>();
    options.add(correct);
    
    const range = diff === "easy" ? 5 : diff === "medium" ? 10 : 15;
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * range) - Math.floor(range / 2);
      const option = correct + offset;
      if (option >= 0) {
        options.add(option);
      }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setProblemsAnswered(0);
    setCurrentProblem(generateProblem(difficulty));
    setGameState("playing");
    setSelectedAnswer(null);
    setIsCorrect(null);

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
    
    saveResult({
      gameType: "math-challenge",
      score,
      level: difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3,
      duration: 60 - timeLeft,
      accuracy: problemsAnswered > 0 ? Math.round((score / problemsAnswered) * 100) : 0,
    });

    toast({
      title: "Game Complete!",
      description: `You scored ${score} points in 60 seconds!`,
      variant: "default",
    });
  };

  const handleAnswer = (answer: number) => {
    if (!currentProblem || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentProblem.answer;
    
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

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentProblem(generateProblem(difficulty));
    }, 500);
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
            Math Challenge
          </CardTitle>
          <CardDescription>
            Solve math problems as fast as you can! Each correct answer earns points, and building a streak gives you bonus points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className="capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startGame} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            Start Challenge
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
          <CardDescription>Great effort!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{problemsAnswered}</p>
              <p className="text-sm text-muted-foreground">Solved</p>
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
            Change Difficulty
          </Button>
          <Button onClick={startGame} className="flex-1">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Math Challenge</CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeLeft <= 10 ? "text-red-500 font-bold" : ""}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>{streak} streak</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            {currentProblem?.num1} {currentProblem?.operator} {currentProblem?.num2} = ?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentProblem?.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? (option === currentProblem.answer ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className="text-lg"
            >
              {option}
            </Button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isCorrect ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
          }`}>
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
              {isCorrect ? "Correct!" : `Wrong! Answer was ${currentProblem?.answer}`}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Score: {score}</span>
          <span>Solved: {problemsAnswered}</span>
        </div>
      </CardContent>
    </Card>
  );
}
