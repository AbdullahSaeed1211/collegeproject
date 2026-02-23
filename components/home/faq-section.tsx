"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQS = [
  {
    question: "Is this right for my age?",
    answer: "Absolutely. Our games are designed for adults of all ages. Whether you're 30 and want to stay sharp, or 60+ and want to maintain cognitive health, the training adapts to your level. Many of our most dedicated users are 45-65 years old.",
  },
  {
    question: "What if it doesn't work for me?",
    answer: "Brain training, like physical exercise, requires consistency. Most users notice improvements in focus and memory within 2-3 weeks of daily training. Plus, it's completely free to try — no credit card required, no risk.",
  },
  {
    question: "How is this different from other brain apps?",
    answer: "We focus on real, measurable cognitive skills — not just entertainment. Our games are based on neuroscience research, and we show you exactly how you're improving with detailed progress tracking. Plus, our leaderboard and streaks keep you motivated.",
  },
  {
    question: "How long until I see results?",
    answer: "Most users report feeling mentally sharper within 2-3 weeks of consistent daily training. For measurable improvements in memory and processing speed, expect to see changes in your scores within 4-6 weeks.",
  },
  {
    question: "What's the catch? Why is it free?",
    answer: "We believe everyone deserves access to brain training tools. The core games and tracking are completely free. We offer optional premium features for users who want deeper insights, but you can train effectively without spending anything.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-muted/10">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before starting
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-base md:text-lg py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
