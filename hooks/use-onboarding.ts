"use client";

import { useState, useEffect } from "react";

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = () => {
      if (typeof window !== "undefined") {
        const completed = localStorage.getItem("onboarding_completed");
        setShowOnboarding(!completed);
      }
      setIsLoading(false);
    };

    checkOnboarding();
  }, []);

  const completeOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_completed", "true");
    }
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("onboarding_completed");
      localStorage.removeItem("user_goals");
      localStorage.removeItem("daily_goal_minutes");
    }
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
