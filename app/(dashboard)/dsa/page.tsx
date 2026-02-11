
"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LayoutGrid, Type, Hash, RefreshCw, ArrowUpDown, // Beginner
  Link as LinkIcon, Layers, ListOrdered, Search, Zap, Binary, // Intermediate
  Network, Share2, Grid3X3, Undo2, GitMerge, Boxes, Database, // Expert
  ChevronRight, Trophy, BookOpen
} from "lucide-react"

const categories = [
  {
    name: "Essential Foundations (Beginner)",
    description: "Build your base with core concepts.",
    icon: BookOpen,
    color: "text-blue-400",
    topics: [
      { name: "Arrays", icon: LayoutGrid, color: "text-blue-400", bg: "bg-blue-500/10" },
      { name: "Strings", icon: Type, color: "text-green-400", bg: "bg-green-500/10" },
      { name: "Hashing", icon: Hash, color: "text-purple-400", bg: "bg-purple-500/10" },
      { name: "Recursion", icon: RefreshCw, color: "text-orange-400", bg: "bg-orange-500/10" },
      { name: "Basic Sorting", icon: ArrowUpDown, color: "text-yellow-400", bg: "bg-yellow-500/10" }
    ]
  },
  {
    name: "Linear Data Structures (Intermediate)",
    description: "Master sequential data organization.",
    icon: Layers,
    color: "text-purple-400",
    topics: [
      { name: "Linked Lists", icon: LinkIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
      { name: "Stacks", icon: Layers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
      { name: "Queues", icon: ListOrdered, color: "text-cyan-400", bg: "bg-cyan-500/10" },
      { name: "Binary Search", icon: Search, color: "text-teal-400", bg: "bg-teal-500/10" },
      { name: "Fast Sorting", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
      { name: "Bit Manipulation", icon: Binary, color: "text-emerald-400", bg: "bg-emerald-500/10" }
    ]
  },
  {
    name: "Advanced Nonlinear Topics (Expert)",
    description: "Conquer complex hierarchical data.",
    icon: Trophy,
    color: "text-red-400",
    topics: [
      { name: "Trees", icon: Network, color: "text-lime-400", bg: "bg-lime-500/10" },
      { name: "Heaps", icon: Database, color: "text-amber-400", bg: "bg-amber-500/10" }, // Using Database as placeholder for Heap structure
      { name: "Graphs", icon: Share2, color: "text-rose-400", bg: "bg-rose-500/10" },
      { name: "Dynamic Programming", icon: Grid3X3, color: "text-sky-400", bg: "bg-sky-500/10" },
      { name: "Backtracking", icon: Undo2, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
      { name: "Tries", icon: GitMerge, color: "text-violet-400", bg: "bg-violet-500/10" },
      { name: "Disjoint Set Union", icon: Boxes, color: "text-slate-400", bg: "bg-slate-500/10" }
    ]
  }
]

export default function DSAPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">DSA Mastery Path 🚀</h1>
          <p className="text-slate-400">From arrays to graphs, master every structure.</p>
        </div>
      </div>

      <div className="grid gap-12">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-[#1E293B] border border-white/5 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
                <p className="text-slate-400 text-sm">{cat.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cat.topics.map((topic) => (
                <Link href={`/learn/${encodeURIComponent(topic.name)}`} key={topic.name}>
                  <Card className="bg-[#1E293B]/40 border-white/5 hover:border-blue-500/50 hover:bg-[#1E293B]/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer h-full group">
                    <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                      <div className={`w-12 h-12 shrink-0 rounded-xl ${topic.bg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <topic.icon className={`w-6 h-6 ${topic.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                          {topic.name}
                        </CardTitle>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
