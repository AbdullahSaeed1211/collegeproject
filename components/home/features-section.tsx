"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <Brain className="h-7 w-7" />,
    title: "Train Daily",
    description: "9+ science-backed games that target memory, focus, and processing speed.",
    color: "bg-blue-500",
    link: "/cognitive-games",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Track Progress",
    description: "See exactly how your cognitive abilities improve week over week.",
    color: "bg-purple-500",
    link: "/progress",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Stay Sharp",
    description: "Build cognitive reserve to protect your brain as you age.",
    color: "bg-green-500",
    link: "/dashboard",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6" id="solutions">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            The Solution
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Your Personal Brain Gym
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Everything you need to strengthen your mind in one simple platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 md:p-8">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-primary group/link" asChild>
                    <Link href={feature.link}>
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
