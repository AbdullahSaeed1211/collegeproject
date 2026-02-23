"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Zap, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    icon: <Play className="h-7 w-7" />,
    title: "Play Games",
    description: "Choose from 9+ brain games. Each one targets a different cognitive skill.",
    color: "bg-blue-500",
  },
  {
    number: "02",
    icon: <Zap className="h-7 w-7" />,
    title: "Earn Points",
    description: "Score points for every game. Build streaks. Climb the leaderboard.",
    color: "bg-yellow-500",
  },
  {
    number: "03",
    icon: <BarChart3 className="h-7 w-7" />,
    title: "See Results",
    description: "Watch your memory, focus, and processing speed improve over time.",
    color: "bg-green-500",
  },
];

const BENEFITS = [
  "Better memory recall",
  "Improved focus",
  "Faster thinking",
  "Problem-solving skills",
  "Mental clarity",
  "Fun & engaging",
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6" id="how-it-works">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Three Simple Steps
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Start training your brain in under 2 minutes. No credit card required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center text-white`}>
                      {step.icon}
                    </div>
                    <span className="text-4xl font-bold text-muted/30">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">What You Will Notice</h3>
            <div className="grid grid-cols-2 gap-4">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center"
          >
            <h4 className="text-2xl font-bold mb-3">Ready to Start?</h4>
            <p className="text-muted-foreground mb-6">
              Join 50,000+ people training their brains daily
            </p>
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/cognitive-games">
                Start Training Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Free forever • No credit card • 10 min/day
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
