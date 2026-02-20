import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Users, Settings, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold tracking-tight">
            Zyncro<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-800/50 text-emerald-400 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">All Boards</span>
          </Link>
          <Link href="/dashboard/workspaces" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Workspaces</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* User Profile Area */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium text-neutral-300">My Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Subtle background glow for that Aceternity vibe */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full"></div>
        
        <div className="relative z-10 p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}