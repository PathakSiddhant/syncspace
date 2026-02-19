import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <nav className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">SyncSpace <span className="text-emerald-500">Dashboard</span></h1>
        <UserButton afterSignOutUrl="/" />
      </nav>
      
      <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-neutral-800 rounded-xl">
        <h2 className="text-xl text-neutral-400">Your collaborative rooms will appear here.</h2>
      </div>
    </div>
  );
}