"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Target, Zap, Trophy, Clock, CheckCircle, 
  ArrowRight, ArrowLeft, Sparkles, Gamepad2
} from "lucide-react";

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome to Care4Brain",
    subtitle: "Your brain training journey starts here",
    icon: <Brain className="h-16 w-16 text-primary" />,
    description: "Train your brain with scientifically-designed games to improve memory, attention, and cognitive performance.",
    content: null,
  },
  {
    id: 2,
    title: "Choose Your Goals",
    subtitle: "What do you want to improve?",
    icon: <Target className="h-16 w-16 text-primary" />,
    description: null,
    content: "goals",
  },
  {
    id: 3,
    title: "How It Works",
    subtitle: "Simple daily training",
    icon: <Gamepad2 className="h-16 w-16 text-primary" />,
    description: null,
    content: "howItWorks",
  },
  {
    id: 4,
    title: "Set Your Pace",
    subtitle: "Daily training goal",
    icon: <Clock className="h-16 w-16 text-primary" />,
    description: null,
    content: "dailyGoal",
  },
  {
    id: 5,
    title: "You're All Set!",
    subtitle: "Start your training now",
    icon: <Sparkles className="h-16 w-16 text-yellow-500" />,
    description: "You're ready to begin your brain training journey. Play games, track progress, and unlock achievements!",
    content: null,
  },
];

const GOALS = [
  { id: "memory", label: "Improve Memory", icon: <Brain className="h-5 w-5" /> },
  { id: "focus", label: "Better Focus", icon: <Target className="h-5 w-5" /> },
  { id: "speed", label: "Faster Thinking", icon: <Zap className="h-5 w-5" /> },
  { id: "fun", label: "Have Fun", icon: <Gamepad2 className="h-5 w-5" /> },
];

const DAILY_GOALS = [
  { id: 5, label: "Casual", description: "5 minutes/day", games: 1 },
  { id: 15, label: "Regular", description: "15 minutes/day", games: 3 },
  { id: 30, label: "Intensive", description: "30 minutes/day", games: 5 },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("onboarding_completed", "true");
        localStorage.setItem("user_goals", JSON.stringify(selectedGoals));
        localStorage.setItem("daily_goal_minutes", dailyGoal.toString());
      }
      
      onComplete();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const renderContent = () => {
    if (step.content === "goals") {
      return (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedGoals.includes(goal.id)
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <div className={selectedGoals.includes(goal.id) ? "text-primary" : "text-muted-foreground"}>
                {goal.icon}
              </div>
              <span className="font-medium">{goal.label}</span>
              {selectedGoals.includes(goal.id) && (
                <CheckCircle className="h-4 w-4 text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      );
    }

    if (step.content === "howItWorks") {
      return (
        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="bg-primary/10 p-2 rounded-full">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Play Games</p>
              <p className="text-sm text-muted-foreground">Choose from 9+ brain training games</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="bg-yellow-500/10 p-2 rounded-full">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-left">
              <p className="font-medium">Earn Points</p>
              <p className="text-sm text-muted-foreground">Score points and climb the leaderboard</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="bg-green-500/10 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-left">
              <p className="font-medium">Track Progress</p>
              <p className="text-sm text-muted-foreground">See your improvement over time</p>
            </div>
          </div>
        </div>
      );
    }

    if (step.content === "dailyGoal") {
      return (
        <div className="space-y-3 mt-6">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setDailyGoal(goal.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                dailyGoal === goal.id
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <div className="text-left">
                <p className="font-medium">{goal.label}</p>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{goal.games} game{goal.games > 1 ? "s" : ""}</p>
              </div>
              {dailyGoal === goal.id && (
                <CheckCircle className="h-5 w-5 text-primary ml-4" />
              )}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {step.icon}
            </div>
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-muted-foreground">{step.subtitle}</p>
          </div>

          {step.description && (
            <p className="text-center text-muted-foreground mb-4">
              {step.description}
            </p>
          )}

          {renderContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? "Setting up..." : "Start Training"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
