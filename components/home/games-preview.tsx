"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Target, Eye, Type, Calculator, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const GAMES = [
  {
    id: "memory",
    name: "Memory Match",
    description: "Find matching pairs to train visual memory",
    icon: <Brain className="h-6 w-6" />,
    color: "bg-blue-500",
    href: "/cognitive-games"
  },
  {
    id: "reaction",
    name: "Reaction Time",
    description: "Test your reflexes with light signals",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-yellow-500",
    href: "/cognitive-games"
  },
  {
    id: "concentration",
    name: "Concentration",
    description: "Find differences between similar images",
    icon: <Eye className="h-6 w-6" />,
    color: "bg-purple-500",
    href: "/cognitive-games"
  },
  {
    id: "math",
    name: "Math Challenge",
    description: "Solve equations against the clock",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-green-500",
    href: "/cognitive-games"
  },
  {
    id: "stroop",
    name: "Stroop Test",
    description: "Name the color, not the word",
    icon: <Type className="h-6 w-6" />,
    color: "bg-red-500",
    href: "/cognitive-games"
  },
  {
    id: "sequence",
    name: "Sequence Memory",
    description: "Remember and repeat patterns",
    icon: <Target className="h-6 w-6" />,
    color: "bg-orange-500",
    href: "/cognitive-games"
  },
];

export function GamesPreview() {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Train Your Brain
          </h2>
          <p className="text-xl text-muted-foreground">
            Play scientifically-designed games to improve memory, attention, and processing speed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/cognitive-games">
              View All Games <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
