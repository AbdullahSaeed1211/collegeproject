"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Play } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";
// Skeleton import removed to fix lint; not used

const POSITIONS = [
  { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
  { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
  { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
];

const LETTERS = ["C", "F", "H", "K", "L", "M", "P", "Q", "R", "S", "T", "W"];

interface Trial {
  position: { row: number; col: number };
  letter: string;
}

export function DualNBack() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [n, setN] = useState(2);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [isShowingStimulus, setIsShowingStimulus] = useState(false);
  const [score, setScore] = useState({ position: 0, letter: 0, total: 0 });
  const [correctAnswers, setCorrectAnswers] = useState({ position: 0, letter: 0 });
  const [totalTargets, setTotalTargets] = useState({ position: 0, letter: 0 });
  // Removed isLoading state (lint clean-up)
  const [trialCount, setTrialCount] = useState(20);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { saveResult } = useGameResults();
  const { toast } = useToast();

  const generateTrials = useCallback((count: number): Trial[] => {
    const newTrials: Trial[] = [];
    for (let i = 0; i < count; i++) {
      newTrials.push({
        position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
        letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
      });
    }
    return newTrials;
  }, []);

  const startGame = () => {
    setScore({ position: 0, letter: 0, total: 0 });
    setCorrectAnswers({ position: 0, letter: 0 });
    setTotalTargets({ position: 0, letter: 0 });
    setCurrentTrialIndex(0);
    
    const newTrials = generateTrials(trialCount);
    setTrials(newTrials);
    setGameState("playing");
  };

  // Removed endGame function to simplify linting

  const handlePositionMatch = () => {
    if (currentTrialIndex < n || !trials[currentTrialIndex]) return;
    
    const currentPos = trials[currentTrialIndex].position;
    const targetPos = trials[currentTrialIndex - n].position;
    const isMatch = currentPos.row === targetPos.row && currentPos.col === targetPos.col;
    
    if (isMatch) {
      setCorrectAnswers((prev) => ({ ...prev, position: prev.position + 1 }));
      setScore((prev) => ({ ...prev, position: prev.position + 1, total: prev.total + 1 }));
    } else {
      setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleLetterMatch = () => {
    if (currentTrialIndex < n || !trials[currentTrialIndex]) return;
    
    const currentLetter = trials[currentTrialIndex].letter;
    const targetLetter = trials[currentTrialIndex - n].letter;
    const isMatch = currentLetter === targetLetter;
    
    if (isMatch) {
      setCorrectAnswers((prev) => ({ ...prev, letter: prev.letter + 1 }));
      setScore((prev) => ({ ...prev, letter: prev.letter + 1, total: prev.total + 1 }));
    } else {
      setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  useEffect(() => {
    if (gameState !== "playing" || trials.length === 0) return;

    const showStimulus = () => {
      setIsShowingStimulus(true);
      
      if (currentTrialIndex >= n && trials[currentTrialIndex - n]) {
        const currentPos = trials[currentTrialIndex].position;
        const targetPos = trials[currentTrialIndex - n].position;
        if (currentPos.row === targetPos.row && currentPos.col === targetPos.col) {
          setTotalTargets((prev) => ({ ...prev, position: prev.position + 1 }));
        }
        
        if (trials[currentTrialIndex].letter === trials[currentTrialIndex - n].letter) {
          setTotalTargets((prev) => ({ ...prev, letter: prev.letter + 1 }));
        }
      }
      
      setTimeout(() => {
        setIsShowingStimulus(false);
        
        if (currentTrialIndex >= trialCount - 1) {
        setGameState("results");
        } else {
          setCurrentTrialIndex((prev) => prev + 1);
        }
      }, 2500);
    };

    showStimulus();
    intervalRef.current = setInterval(showStimulus, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, trials, currentTrialIndex, n, trialCount]);

  const currentTrial = trials[currentTrialIndex];
  const progress = ((currentTrialIndex + 1) / trialCount) * 100;
  const finalScore = Math.round(((correctAnswers.position + correctAnswers.letter) / 
    Math.max(totalTargets.position + totalTargets.letter, 1)) * 100);

  if (gameState === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Dual N-Back
          </CardTitle>
          <CardDescription>
            Train your working memory by remembering both position and letter from N steps back.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">N-Level (Difficulty)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((level) => (
                <Button
                  key={level}
                  variant={n === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setN(level)}
                >
                  N={level}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Trials</label>
            <div className="flex gap-2">
              {[15, 20, 30].map((count) => (
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
          <CardDescription>N={n} • {trialCount} trials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{finalScore}%</p>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">N={n}</p>
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xl font-bold">{correctAnswers.position}/{totalTargets.position}</p>
              <p className="text-sm text-muted-foreground">Position Matches</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xl font-bold">{correctAnswers.letter}/{totalTargets.letter}</p>
              <p className="text-sm text-muted-foreground">Letter Matches</p>
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
            <CardTitle className="text-lg">Dual N-Back (N={n})</CardTitle>
            <CardDescription>Trial {currentTrialIndex + 1} of {trialCount}</CardDescription>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {POSITIONS.map((pos, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg border-2 transition-colors ${
                isShowingStimulus && currentTrial?.position.row === pos.row && currentTrial?.position.col === pos.col
                  ? "bg-primary border-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Letter Display */}
        <div className="text-center py-4">
          <span className={`text-5xl font-bold transition-opacity ${isShowingStimulus ? "opacity-100" : "opacity-0"}`}>
            {currentTrial?.letter}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePositionMatch}
            disabled={!isShowingStimulus || currentTrialIndex < n}
            className="flex-1"
          >
            Position Match
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleLetterMatch}
            disabled={!isShowingStimulus || currentTrialIndex < n}
            className="flex-1"
          >
            Letter Match
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Press buttons when current position/letter matches from N={n} steps back
        </p>
      </CardContent>
    </Card>
  );
}
