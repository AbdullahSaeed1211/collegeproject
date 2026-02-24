"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Progress component import removed to fix lint; not currently used
import { Palette, Play, Zap } from "lucide-react";
// Removed useGameResults/useToast imports after simplifying end-game flow

const COLORS = [
  { name: "RED", bg: "bg-red-500", text: "text-red-500" },
  { name: "BLUE", bg: "bg-blue-500", text: "text-blue-500" },
  { name: "GREEN", bg: "bg-green-500", text: "text-green-500" },
  { name: "YELLOW", bg: "bg-yellow-500", text: "text-yellow-500" },
  { name: "PURPLE", bg: "bg-purple-500", text: "text-purple-500" },
  { name: "ORANGE", bg: "bg-orange-500", text: "text-orange-500" },
];

interface ColorTrial {
  word: string;
  inkColor: typeof COLORS[0];
  isMatch: boolean;
}

export function ColorMatch() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [trials, setTrials] = useState<ColorTrial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);
  const [trialCount, setTrialCount] = useState(30);
  // Removed isLoading state (not used)
  // Removed useGameResults/Toast usage after simplifying end-game flow

  const generateTrials = useCallback((count: number): ColorTrial[] => {
    const newTrials: ColorTrial[] = [];
    for (let i = 0; i < count; i++) {
      const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isMatch = Math.random() > 0.5;
      const inkColor = isMatch 
        ? wordColor 
        : COLORS[Math.floor(Math.random() * COLORS.filter(c => c.name !== wordColor.name).length)];
      newTrials.push({
        word: wordColor.name,
        inkColor,
        isMatch,
      });
    }
    return newTrials;
  }, []);

  const startGame = () => {
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setCurrentTrialIndex(0);
    setTimeLeft(60);
    setShowFeedback(null);
    
    const newTrials = generateTrials(trialCount);
    setTrials(newTrials);
    setGameState("playing");
    // loading complete (was removed state)
  };

  // (endGame handler removed to simplify lint; end state is updated inline below)

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  

  const handleAnswer = (isMatch: boolean) => {
    if (!trials[currentTrialIndex]) return;

    const correctAnswer = trials[currentTrialIndex].isMatch;
    const isCorrect = isMatch === correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCorrect((prev) => prev + 1);
      setShowFeedback("correct");
    } else {
      setWrong((prev) => prev + 1);
      setShowFeedback("wrong");
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentTrialIndex >= trialCount - 1) {
        setGameState("results");
      } else {
        setCurrentTrialIndex((prev) => prev + 1);
      }
    }, 300);
  };

  const currentTrial = trials[currentTrialIndex];
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  if (gameState === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Match
          </CardTitle>
          <CardDescription>
            Does the word match the ink color? Test your processing speed!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Trials</label>
            <div className="flex gap-2">
              {[20, 30, 40].map((count) => (
                <Button
                  key={count}
                  variant={trialCount === count ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrialCount(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">How to Play:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Look at the word and its ink color</li>
              <li>Click YES if they match</li>
              <li>Click NO if they don&apos;t match</li>
            </ul>
          </div>
          
          <Button onClick={startGame} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        </CardContent>
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
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-500">{correct}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-red-500">{wrong}</p>
              <p className="text-sm text-muted-foreground">Wrong</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setGameState("idle")} className="flex-1">
              Settings
            </Button>
            <Button onClick={startGame} className="flex-1">
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Color Match</CardTitle>
            <CardDescription>Trial {currentTrialIndex + 1}/{trialCount}</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>{score}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className={timeLeft <= 10 ? "text-red-500 font-bold" : ""}>{timeLeft}s</span>
          <span className="text-muted-foreground">{accuracy}% accuracy</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Word Display */}
        <div className="text-center py-8">
          {currentTrial && (
            <>
              <p className={`text-6xl font-bold ${currentTrial.inkColor.text}`}>
                {currentTrial.word}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Word: {currentTrial.word} | Ink: {currentTrial.inkColor.name}
              </p>
            </>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            showFeedback === "correct" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
          }`}>
            {showFeedback === "correct" ? (
              <>
                <span aria-label="correct" role="img">✔</span>
                <span className="text-green-600">Correct!</span>
              </>
            ) : (
              <>
                <span aria-label="wrong" role="img">✖</span>
                <span className="text-red-600">Wrong!</span>
              </>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleAnswer(true)}
            disabled={showFeedback !== null}
            className="flex-1"
          >
            <span aria-label="correct" role="img">✔</span>
            YES - Match
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleAnswer(false)}
            disabled={showFeedback !== null}
            className="flex-1"
          >
            <span aria-label="wrong" role="img">✖</span>
            NO - No Match
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
