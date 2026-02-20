"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const routes = [
    { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-neutral-800 bg-neutral-950 h-screen transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Area */}
      <div className={cn(
        "h-16 flex items-center border-b border-neutral-800 transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between px-4"
      )}>
        {/* Logo with smooth width/opacity transition */}
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out", 
            isCollapsed ? "w-0 opacity-0" : "w-24 opacity-100"
          )}
        >
          <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Zyncro<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors outline-none shrink-0"
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center rounded-lg transition-all duration-300",
              isCollapsed ? "justify-center p-3" : "px-3 py-2",
              pathname === route.href 
                ? "bg-neutral-800/50 text-emerald-400" 
                : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
            )}
            title={isCollapsed ? route.label : undefined}
          >
            <route.icon className="w-5 h-5 shrink-0" />
            
            {/* Text with smooth width/opacity transition */}
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out flex items-center",
                isCollapsed ? "w-0 opacity-0 ml-0" : "w-40 opacity-100 ml-3"
              )}
            >
              <span className="font-medium whitespace-nowrap">
                {route.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile Area */}
      <div className={cn(
        "p-4 border-t border-neutral-800 flex items-center transition-all duration-300", 
        isCollapsed ? "justify-center" : "justify-start px-4"
      )}>
        <div className="shrink-0 flex items-center justify-center">
          <UserButton afterSignOutUrl="/" />
        </div>
        
        {/* Account Text with smooth width/opacity transition */}
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0 ml-0" : "w-32 opacity-100 ml-3"
          )}
        >
          <span className="text-sm font-medium text-neutral-300 whitespace-nowrap">
            My Account
          </span>
        </div>
      </div>
    </aside>
  );
}