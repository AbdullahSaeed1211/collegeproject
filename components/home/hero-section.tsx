"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Play, Zap, Clock } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function HeroSection() {
  return (
    <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-10 bg-[length:20px_20px] bg-center [background-image:linear-gradient(rgba(var(--magic-primary),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--magic-primary),0.05)_1px,transparent_1px)]"></div>
      
      {/* Gradient blobs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[rgba(var(--magic-primary),0.2)] to-[rgba(var(--magic-accent),0.2)] blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-[rgba(var(--magic-secondary),0.2)] to-[rgba(var(--magic-primary),0.2)] blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm">
              <span className="bg-green-500/20 text-green-600 rounded-full p-1 mr-2">
                <Brain className="h-3.5 w-3.5" />
              </span>
              <AnimatedShinyText shimmerWidth={150} shimmerDuration={3} shimmerDelay={4}>
                Join 50,000+ people training daily
              </AnimatedShinyText>
            </div>

            {/* Headline - Max 8 words */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Train Your Brain,{" "}
              <span className="magic-gradient-text">Sharpen Your Mind</span>
            </h1>

            {/* Subheadline - Max 20 words */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Science-backed games that boost memory, focus, and processing speed in just 10 minutes a day.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all border-none text-base px-8" 
                asChild
              >
                <Link href="/cognitive-games">
                  Start Training Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 hover:bg-primary/5 backdrop-blur-sm bg-background/50 text-base px-8" 
                asChild
              >
                <Link href="#how-it-works">
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.8/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>10 min/day</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl overflow-hidden border shadow-2xl">
              <Image
                src="/brain-hero.png"
                alt="Brain training visualization showing neural connections lighting up during cognitive exercises"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating stats cards */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded">
                    <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Memory Score</p>
                    <p className="text-lg font-bold">+23%</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Focus Level</p>
                    <p className="text-lg font-bold">High</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-5 right-5 h-20 w-20 rounded-full bg-gradient-to-br from-[rgba(var(--magic-primary),0.15)] to-[rgba(var(--magic-accent),0.15)] blur-xl"></div>
              <div className="absolute bottom-5 left-5 h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(var(--magic-secondary),0.15)] to-[rgba(var(--magic-primary),0.15)] blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
