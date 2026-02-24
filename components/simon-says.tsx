"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Play } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";

const COLORS = [
  { name: "red", bg: "bg-red-500", active: "bg-red-400" },
  { name: "blue", bg: "bg-blue-500", active: "bg-blue-400" },
  { name: "green", bg: "bg-green-500", active: "bg-green-400" },
  { name: "yellow", bg: "bg-yellow-500", active: "bg-yellow-400" },
];

type GamePhase = "idle" | "showing" | "input" | "results";

export function SimonSays() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"normal" | "fast">("normal");
  const { saveResult } = useGameResults();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToSequence = useCallback(() => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].name;
    setSequence((prev) => [...prev, randomColor]);
  }, []);

  const playSequence = useCallback(async (seq: string[]) => {
    setPhase("showing");
    const delay = speed === "normal" ? 800 : 500;
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, delay);
      });
      setActiveColor(seq[i]);
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, 300);
      });
      setActiveColor(null);
    }
    
    setPhase("input");
  }, [speed]);

  const startGame = () => {
    setGameState("playing");
    setPhase("idle");
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (gameState === "playing" && phase === "idle" && isPlaying) {
      addToSequence();
    }
  }, [gameState, phase, isPlaying, addToSequence]);

  useEffect(() => {
    if (sequence.length > 0 && gameState === "playing" && phase === "idle") {
      playSequence(sequence);
    }
  }, [sequence, gameState, phase, playSequence]);

  const handleColorClick = (color: string) => {
    if (phase !== "input") return;
    
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 150);

    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      gameOver();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore((prev) => prev + level * 10);
      setLevel((prev) => prev + 1);
      setPlayerSequence([]);
      setPhase("idle");
    }
  };

  const gameOver = async () => {
    setPhase("results");
    setGameState("results");
    setIsPlaying(false);
    
    if (score > highScore) {
      setHighScore(score);
    }
    
    await saveResult({
      gameType: "simon-says",
      score,
      level,
      duration: level * 3,
      accuracy: level > 0 ? 100 : 0,
    });

    toast({
      title: "Game Over!",
      description: `You reached level ${level} with ${score} points!`,
      variant: "default",
    });
  };

  const getButtonClass = (color: typeof COLORS[0]) => {
    const isActive = activeColor === color.name;
    return `${color.bg} ${isActive ? color.active : ""} ${
      isActive ? "scale-105 shadow-lg" : ""
    } transition-all duration-150`;
  };

  if (gameState === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Simon Says
          </CardTitle>
          <CardDescription>
            Watch the pattern, then repeat it! Test your memory and concentration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Speed</label>
            <div className="flex gap-2">
              <Button
                variant={speed === "normal" ? "default" : "outline"}
                size="sm"
                onClick={() => setSpeed("normal")}
              >
                Normal
              </Button>
              <Button
                variant={speed === "fast" ? "default" : "outline"}
                size="sm"
                onClick={() => setSpeed("fast")}
              >
                Fast
              </Button>
            </div>
          </div>

          {highScore > 0 && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <span className="text-muted-foreground">High Score:</span>{" "}
              <span className="font-bold">{highScore}</span>
            </div>
          )}
          
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
          <CardTitle>Game Over!</CardTitle>
          <CardDescription>Great memory!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">Level {level}</p>
              <p className="text-sm text-muted-foreground">Reached</p>
            </div>
          </div>
          
          {score > highScore && (
            <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg text-center">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">
                New High Score!
              </p>
            </div>
          )}
          
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
            <CardTitle className="text-lg">Simon Says</CardTitle>
            <CardDescription>
              {phase === "showing" 
                ? "Watch carefully..." 
                : phase === "input" 
                  ? "Your turn!" 
                  : "Get ready..."}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{score}</p>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              disabled={phase !== "input"}
              className={`
                aspect-square rounded-lg ${getButtonClass(color)}
                ${phase === "input" ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}
              `}
            />
          ))}
        </div>

        {/* Progress */}
        {phase === "input" && (
          <div className="text-center">
            <Progress 
              value={(playerSequence.length / sequence.length) * 100} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {playerSequence.length} / {sequence.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
