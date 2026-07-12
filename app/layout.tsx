import type { Metadata } from "next";
import { Space_Grotesk, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/frontend/components/providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
        className={`${spaceGrotesk.variable} ${robotoMono.variable} antialiased bg-[#FCFCFD] text-slate-800 font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

