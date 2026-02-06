import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain Health Toolkit | Care4Brain",
  description: "Access a comprehensive set of tools designed to assess, train, and monitor your brain health for improved cognitive function.",
  keywords: "brain health, cognitive tools, brain training, health assessment, brain exercises, health tracking",
  openGraph: {
    title: "Brain Health Toolkit | Care4Brain",
    description: "Access a comprehensive set of tools designed to assess, train, and monitor your brain health for improved cognitive function.",
    url: "https://care4brain.com/tools",
    type: "website",
    images: [
      {
        url: "/images/og-toolkit.jpg",
        width: 1200,
        height: 630,
        alt: "Care4Brain Brain Health Toolkit"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Health Toolkit | Care4Brain",
    description: "Access a comprehensive set of tools designed to assess, train, and monitor your brain health for improved cognitive function.",
    images: ["/images/og-toolkit.jpg"]
  }
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 