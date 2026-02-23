"use client";

import { motion } from "framer-motion";
import { Brain, Clock, TrendingDown } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Can't remember names moments after introductions",
    description: "You meet someone new, and seconds later their name has completely slipped your mind. It's embarrassing and happens more often than you'd like to admit.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Lose focus halfway through important tasks",
    description: "You sit down to work, but your mind wanders. Before you know it, an hour has passed and you've accomplished nothing meaningful.",
  },
  {
    icon: <TrendingDown className="h-6 w-6" />,
    title: "Feel mentally slower than you used to be",
    description: "Thoughts don't come as quickly. Problem-solving takes longer. You wonder if this is just 'getting older' or something you can actually improve.",
  },
];

export function ProblemAgitation() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Sound Familiar?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            You are not alone. These frustrating moments happen to millions of people every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PAIN_POINTS.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="h-full p-6 md:p-8 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                    {pain.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{pain.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pain.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-lg md:text-xl font-medium">
            The good news? <span className="text-primary">Your brain can change.</span>
          </p>
          <p className="text-muted-foreground mt-2">
            Neuroplasticity means you can strengthen your mind at any age.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
