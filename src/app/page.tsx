"use client";

import Link from "next/link";
import { ArrowRight, Play, Video, Users, MousePointer2, Layout, Zap, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden relative">
      
      {/* 🌌 BACKGROUND GLOWING ORBS (Animated) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-600/20 blur-[150px] rounded-[100%] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-[100%] pointer-events-none"
      />

      {/* 🌟 PREMIUM NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              SyncSpace<span className="text-emerald-500">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/sign-up">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black hover:bg-neutral-200 rounded-full px-5 py-2 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center relative z-10">
        
        {/* 🚀 HERO TEXT SECTION */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            SyncSpace 2.0 is now live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500"
          >
            Where teams <br /> think out loud.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The endless canvas with built-in async video recording. Stop scheduling meetings to explain ideas. Just draw, record, and share the link.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/sign-up" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="w-full sm:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-base font-bold shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group">
                  Start Creating Free 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 backdrop-blur-md">
                  <Play className="w-5 h-5 fill-white" /> Watch Demo
                </button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* 💻 THE FLOATING GLASS DASHBOARD MOCKUP */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto relative perspective-1000"
        >
          {/* Floating Animation for the entire window */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[24px] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden aspect-[16/9] flex flex-col ring-1 ring-white/5"
          >
            {/* macOS Window Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto px-3 py-1 rounded-md bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <Lock className="w-3 h-3" /> syncspace.com/board/xyz
              </div>
            </div>
            
            {/* Canvas Area with Animated Elements */}
            <div className="flex-1 relative bg-[url('/grid-pattern.svg')] opacity-80 overflow-hidden">
              
              {/* Fake Toolbar */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-3 bg-[#111] border border-white/10 rounded-2xl shadow-2xl">
                <div className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"></div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center ring-1 ring-emerald-500/50"><MousePointer2 className="w-4 h-4" /></div>
                <div className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"></div>
              </div>

              {/* 🖱️ Animated Cursor 1 (Rahul) */}
              <motion.div 
                animate={{ x: [0, 150, 50, 0], y: [0, 80, -40, 0] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 left-1/3 z-20"
              >
                <MousePointer2 className="w-7 h-7 text-amber-500 fill-amber-500 -rotate-12 drop-shadow-lg" />
                <div className="bg-amber-500 text-black text-[11px] font-bold px-3 py-1 rounded-full mt-1 ml-4 shadow-lg">Rahul typing...</div>
              </motion.div>

              {/* 🖱️ Animated Cursor 2 (You) */}
              <motion.div 
                animate={{ x: [0, -100, -20, 0], y: [0, -60, 50, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-1/3 z-20"
              >
                <MousePointer2 className="w-7 h-7 text-emerald-500 fill-emerald-500 -rotate-12 drop-shadow-lg" />
                <div className="bg-emerald-500 text-black text-[11px] font-bold px-3 py-1 rounded-full mt-1 ml-4 shadow-lg">You</div>
              </motion.div>

              {/* Fake Recording Widget */}
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 right-8 flex items-center gap-3 bg-[#111]/90 backdrop-blur-xl border border-white/10 p-2 pr-5 rounded-full shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/150?img=11" alt="avatar" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Recording
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5">02:14 / 05:00</span>
                </div>
              </motion.div>

              {/* Fake Sticky Note */}
              <motion.div 
                animate={{ rotate: [-2, 2, -2] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 right-20 w-48 h-48 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm shadow-xl"
              >
                <div className="w-full h-2 bg-yellow-500/40 rounded-full mb-3"></div>
                <div className="w-3/4 h-2 bg-yellow-500/40 rounded-full mb-3"></div>
                <div className="w-5/6 h-2 bg-yellow-500/40 rounded-full"></div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>

        {/* 🍱 ANIMATED BENTO GRID */}
        <div id="features" className="w-full max-w-5xl mx-auto mt-40 pt-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Built for speed & clarity.</h2>
            <p className="text-xl text-neutral-400">Everything you need to collaborate without the noise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Big Feature */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 group bg-[#111]/50 backdrop-blur-sm border border-white/5 rounded-[32px] p-10 hover:bg-[#111] hover:border-emerald-500/30 transition-all flex flex-col justify-end min-h-[300px] relative overflow-hidden shadow-lg">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                <Video className="w-80 h-80 text-emerald-500" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Video className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">Async Video Recording</h3>
              <p className="text-neutral-400 text-lg max-w-md">
                Record your screen, camera, and voice directly on the canvas. Give context to your designs without booking a single meeting.
              </p>
            </motion.div>

            {/* Small Feature 1 */}
            <motion.div whileHover={{ y: -5 }} className="group bg-[#111]/50 backdrop-blur-sm border border-white/5 rounded-[32px] p-8 hover:bg-[#111] hover:border-emerald-500/30 transition-all shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-colors">
                <Users className="w-7 h-7 text-neutral-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Multiplayer Sync</h3>
              <p className="text-neutral-400">
                See cursors fly across the screen. Real-time collaboration that actually feels real and responsive.
              </p>
            </motion.div>

            {/* Small Feature 2 */}
            <motion.div whileHover={{ y: -5 }} className="group bg-[#111]/50 backdrop-blur-sm border border-white/5 rounded-[32px] p-8 hover:bg-[#111] hover:border-emerald-500/30 transition-all shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                <Layout className="w-7 h-7 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Infinite Canvas</h3>
              <p className="text-neutral-400">
                Zoom out for the big picture, zoom in to obsess over the tiny details. Never run out of creative space.
              </p>
            </motion.div>

            {/* Wide Feature */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 group bg-[#111]/50 backdrop-blur-sm border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-[#111] hover:border-emerald-500/30 transition-all flex flex-col justify-center shadow-lg relative overflow-hidden">
               <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-neutral-300" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-neutral-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Blazing Fast & Secure</h3>
              <p className="text-neutral-400 text-lg max-w-lg relative z-10">
                Built on Next.js and secure WebSockets. Your data is encrypted, and your canvas loads instantly no matter how many elements you add.
              </p>
            </motion.div>

          </div>
        </div>

        {/* 🏁 FINAL CTA */}
        <div className="w-full max-w-3xl mx-auto mt-40 mb-20 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-6 text-white relative z-10">Ready to clear the clutter?</h2>
          <p className="text-neutral-400 mb-10 text-xl relative z-10">Join teams who are already building the future on SyncSpace.</p>
          <Link href="/sign-up" className="relative z-10">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="h-14 px-10 bg-white hover:bg-neutral-200 text-black rounded-full text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
            >
              Get Started for Free
            </motion.button>
          </Link>
        </div>

      </main>

      {/* 🦶 FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] py-10 text-center text-sm text-neutral-600 relative z-10">
        <p>© {new Date().getFullYear()} SyncSpace. Crafted with precision.</p>
      </footer>
    </div>
  );
}