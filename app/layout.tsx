import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/frontend/components/providers";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackathon Game | The Ultimate Technical Simulation",
  description: "A high-stakes, decision-driven technical simulation. Architect your stack, manage scope creep, impress the AI judges, and survive the 14-stage development lifecycle.",
  openGraph: {
    title: "Hackathon Game",
    description: "Architect your stack and impress the AI judges in this high-stakes development simulation.",
    url: "https://hackathongame.com",
    siteName: "Hackathon Game",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Game",
    description: "The ultimate technical hackathon simulation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

