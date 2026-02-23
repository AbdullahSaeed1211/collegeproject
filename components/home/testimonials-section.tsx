"use client";

import { motion } from "framer-motion";
import { Star, Users, Brain, TrendingUp } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "I've noticed a real improvement in my memory after just 3 weeks. Names don't slip my mind anymore.",
    name: "Sarah M.",
    role: "Marketing Director",
    result: "+31% memory score",
    avatar: "SM",
  },
  {
    quote: "The daily challenges keep me coming back. It's like a gym for my brain that I actually enjoy.",
    name: "David K.",
    role: "Software Engineer",
    result: "45 day streak",
    avatar: "DK",
  },
  {
    quote: "As I approached 50, I worried about cognitive decline. Now I feel sharper than I did in my 30s.",
    name: "Linda R.",
    role: "Business Owner",
    result: "+28% focus",
    avatar: "LR",
  },
];

const STATS = [
  { value: "50K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
  { value: "1M+", label: "Games Played", icon: <Brain className="h-5 w-5" /> },
  { value: "4.8", label: "User Rating", icon: <Star className="h-5 w-5" /> },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16"
        >
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl md:text-4xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Real People, Real Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who are already training their brains daily.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    {testimonial.result}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
