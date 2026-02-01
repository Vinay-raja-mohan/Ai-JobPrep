
"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Clock, TrendingUp, Briefcase, Brain, ChevronRight } from "lucide-react"

const categories = [
  {
    name: "Arithmetic",
    icon: Calculator,
    color: "text-blue-400",
    topics: [
      "Percentages", "Profit & Loss", "Simple Interest", "Compound Interest",
      "Time & Work", "Time Speed Distance", "Ratio & Proportion", "Averages"
    ]
  },
  {
    name: "Reasoning",
    icon: Brain,
    color: "text-purple-400",
    topics: [
      "Number Series", "Coding Decoding", "Blood Relations", "Direction Sense",
      "Seating Arrangement", "Syllogism", "Clocks & Calendars"
    ]
  }
]

export default function AptitudePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Aptitude Practice Arena 🧠</h1>
          <p className="text-slate-400">Master the essential topics for your placement exams.</p>
        </div>
      </div>

      <div className="grid gap-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <div className={`p-2 rounded-lg bg-white/5 ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.topics.map((topic) => (
                <Link href={`/aptitude/practice?topic=${encodeURIComponent(topic)}`} key={topic}>
                  <Card className="bg-[#1E293B]/40 border-white/5 hover:border-blue-500/50 hover:bg-[#1E293B]/80 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-pointer h-full group">
                    <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                        {topic}
                      </CardTitle>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
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
