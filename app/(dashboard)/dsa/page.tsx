
"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, GitBranch, Layers, Grid } from "lucide-react"

const topics = [
  { name: "Arrays & Strings", icon: <Grid className="w-6 h-6 text-blue-500" /> },
  { name: "Linked Lists", icon: <GitBranch className="w-6 h-6 text-green-500" /> },
  { name: "Stacks & Queues", icon: <Layers className="w-6 h-6 text-purple-500" /> },
  { name: "Trees & Graphs", icon: <GitBranch className="w-6 h-6 text-orange-500" /> }, // Reusing icon for simplicity
  { name: "Dynamic Programming", icon: <Code className="w-6 h-6 text-red-500" /> },
  { name: "Sorting & Searching", icon: <Code className="w-6 h-6 text-yellow-500" /> },
]

export default function DSAPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Data Structures & Algorithms 💻</h1>
      <p className="text-muted-foreground mb-8">Master the building blocks of coding interviews.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {topics.map((item) => (
          <Link href={`/dsa/practice?topic=${encodeURIComponent(item.name)}`} key={item.name}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer group hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 p-3 bg-muted rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
                  {item.icon}
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>Practice problems & patterns</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
