export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import { ProgressTracker } from "@/components/progress-tracker";

export const metadata: Metadata = {
  title: "Progress Tracker | Care4Brain",
  description: "Track your cognitive performance over time with detailed insights and performance metrics.",
  keywords: "cognitive tracking, brain health progress, performance metrics, cognitive testing results",
};

export default function ProgressTrackerPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Progress Tracker
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl">
            Track your cognitive performance over time, identify trends, and monitor improvement across different cognitive domains.
          </p>
        </div>

        <ProgressTracker />
      </div>
    </div>
  );
} 