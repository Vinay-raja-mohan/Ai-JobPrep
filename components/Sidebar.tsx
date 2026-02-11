"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  GraduationCap,
  Map,
  Bot,

  Settings,
  Sliders,
  FileText,
  LogOut,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ApiKeyDialog } from "@/components/ApiKeyDialog"

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "My Roadmap", icon: Map },
  { href: "/aptitude", label: "Aptitude", icon: BookOpen },
  { href: "/dsa", label: "DSA", icon: Code2 },
  { href: "/core-skills", label: "Core Skills", icon: GraduationCap },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/mentor", label: "AI Mentor", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0B1120] border-r border-[#1E293B] flex flex-col hidden md:flex text-slate-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="font-bold text-xl text-white tracking-tight">AI JobPrep</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href) && link.href !== "/dashboard" || pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "hover:bg-[#1E293B] hover:text-white"
              )}
            >
              <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Shield */}
      <div className="p-3 mt-auto">
        <div className="bg-[#1E293B]/50 rounded-xl p-3 border border-[#334155] backdrop-blur-sm space-y-1">

          <Link
            href="/profile"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-1 py-1 transition-colors group"
          >
            <Settings className="w-3.5 h-3.5 group-hover:text-blue-400" /> Settings
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-1 py-1 transition-colors group"
          >
            <Sliders className="w-3.5 h-3.5 group-hover:text-blue-400" /> Preferences
          </Link>


          <ApiKeyDialog className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-1 py-1 transition-colors cursor-pointer group" />
        </div>
      </div>
    </aside>
  )
}
