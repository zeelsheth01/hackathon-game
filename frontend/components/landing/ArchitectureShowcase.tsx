"use client";

import { motion } from "framer-motion";
import { Database, Layout, Sparkles, Server } from "lucide-react";

const features = [
  {
    title: "Next.js 15 App Router",
    description: "Built on the bleeding edge with React 19, Server Components, and optimized Framer Motion transitions for a butter-smooth 60fps experience.",
    icon: <Layout className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Global State Machine",
    description: "Complex 14-stage game loop managed entirely via Zustand with custom persist middleware, ensuring zero progress loss on reload.",
    icon: <Server className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "Prisma x PostgreSQL",
    description: "Robust type-safe ORM tracking user scores, leaderboards, and hackathon projects with sub-millisecond query performance.",
    icon: <Database className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Generative AI Judges",
    description: "Dynamic end-game evaluations powered by OpenAI APIs. Virtual judges roast or praise your tech stack choices using tailored prompt personas.",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-500/10 border-amber-500/20",
  },
];

export function ArchitectureShowcase() {
  return (
    <section id="architecture" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4"
          >
            Engineering Excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            More than just a game. A showcase of modern web architecture, state management, and full-stack integration.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-900/20 transition-all cursor-default group relative overflow-hidden"
            >
              {/* Card internal glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-transform shadow-inner`}>
                {feature.icon}
              </div>
              <h3 className="relative z-10 text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
              <p className="relative z-10 text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
