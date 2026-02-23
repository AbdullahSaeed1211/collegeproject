export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/home/hero-section";
import { ProblemAgitation } from "@/components/home/problem-agitation";
import { FeaturesSection } from "@/components/home/features-section";
import { GamesPreview } from "@/components/home/games-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Train Your Brain | Science-Backed Cognitive Training",
  description: "Boost memory, focus, and processing speed with 10 minutes of daily brain training. Join 50,000+ people sharpening their minds with science-backed games.",
  keywords: "brain training, cognitive games, memory improvement, focus training, brain exercises, mental fitness",
  openGraph: {
    title: "Train Your Brain | Science-Backed Cognitive Training",
    description: "Boost memory, focus, and processing speed with 10 minutes of daily brain training. Join 50,000+ people sharpening their minds.",
    url: "https://care4brain.vercel.app",
    type: "website",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Brain Training Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Train Your Brain | Science-Backed Cognitive Training",
    description: "Boost memory, focus, and processing speed with 10 minutes of daily brain training.",
    images: ["/images/og-home.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function Home() {
  return (
    <main className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <ProblemAgitation />
      <FeaturesSection />
      <GamesPreview />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
