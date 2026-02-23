"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, Award, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    icon: <Brain className="h-8 w-8" />,
    title: "Assess Your Brain",
    description: "Take our cognitive assessments to understand your current brain health and identify areas for improvement."
  },
  {
    number: "02",
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Train Daily",
    description: "Play fun, science-backed games for just 10-15 minutes a day to strengthen your cognitive abilities."
  },
  {
    number: "03",
    icon: <Award className="h-8 w-8" />,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed analytics and unlock achievements as you progress."
  }
];

const BENEFITS = [
  "Improved memory and recall",
  "Better focus and concentration",
  "Faster processing speed",
  "Enhanced problem-solving",
  "Reduced cognitive decline risk",
  "Fun and engaging experience"
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 md:px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Start your brain training journey in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full relative overflow-hidden group">
                <CardContent className="p-8">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                  <span className="text-6xl font-bold text-muted/20 absolute top-4 right-4">
                    {step.number}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">Benefits of Brain Training</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h4 className="text-xl font-semibold mb-4">Ready to Get Started?</h4>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who are already improving their brain health
            </p>
            <Button size="lg" asChild>
              <Link href="/cognitive-games">
                Start Training Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
