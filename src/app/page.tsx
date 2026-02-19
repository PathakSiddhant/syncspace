import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black text-white overflow-hidden">
      {/* Background Grid Effect (We'll make this pop later) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center pt-32 px-4 text-center">
        <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm font-medium text-neutral-300 backdrop-blur-3xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          SyncSpace AI v1.0 is shipping soon
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          The ultimate canvas for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-emerald-400">
            real-time collaboration.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl">
          Draw, chat, and video call on a zero-lag whiteboard. Powered by AI to turn your messy scribbles into structured ideas instantly.
        </p>

        <div className="flex gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors">
            Start Drawing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#features" className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors">
            See Features
          </Link>
        </div>
      </div>
    </main>
  );
}