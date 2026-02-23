"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Brain, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const TRANSFORMATION = [
  { before: "Can't remember names", after: "Names stick easily", icon: <Brain className="h-5 w-5" /> },
  { before: "Mind feels foggy", after: "Mental clarity", icon: <Zap className="h-5 w-5" /> },
  { before: "Scattered focus", after: "Sharp concentration", icon: <Trophy className="h-5 w-5" /> },
];

export function CtaSection() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Urgency */}
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Start training in the next 5 minutes
          </span>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Your Brain Is Waiting.
            <br />
            <span className="text-primary">Are You Ready?</span>
          </h2>

          {/* Transformation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
            {TRANSFORMATION.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border"
              >
                <div className="text-primary">{item.icon}</div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground line-through">{item.before}</p>
                  <p className="font-medium text-foreground">{item.after}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <Link href="/cognitive-games">
                Start Training Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Risk Reversal */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-muted-foreground mt-4">
            Join <span className="font-semibold text-foreground">50,000+</span> people who train their brains daily
          </p>
        </motion.div>
      </div>
    </section>
  );
}
