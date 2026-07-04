"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Milestone, ArrowRight, Loader2, Compass, Briefcase, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Step {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
}

interface CareerPathData {
  title: string;
  description: string;
  steps: Step[];
}

export default function CareerPathPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [pathData, setPathData] = useState<CareerPathData | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasCheckedCache, setHasCheckedCache] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const parsedUser = JSON.parse(stored)
      setUser(parsedUser)
      
      const cached = localStorage.getItem(`careerPath_${parsedUser.email}`)
      if (cached) {
        try {
          setPathData(JSON.parse(cached))
        } catch (e) {
          console.error("Cache error", e)
        }
      }
      setHasCheckedCache(true)
    } else {
      router.push("/login")
    }
  }, [router])

  async function generateCareerPath() {
    if (!user) return
    setLoading(true)

    try {
      const res = await fetch("/api/career-path/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": localStorage.getItem("gemini_api_key") || ""
        },
        body: JSON.stringify({
          educationStage: user.educationStage,
          targetRole: user.targetRole,
          coreSkill: user.coreSkill
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate path")
      
      setPathData(data.path)
      localStorage.setItem(`careerPath_${user.email}`, JSON.stringify(data.path))
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleRegenerate() {
    setPathData(null)
    localStorage.removeItem(`careerPath_${user.email}`)
    generateCareerPath()
  }

  if (!hasCheckedCache) {
    return null; // wait for initial check
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-slate-400 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="animate-pulse">Charting your career path...</p>
      </div>
    )
  }

  if (!pathData) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-slate-400 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-[#1E293B] p-6 rounded-full shadow-lg shadow-blue-900/20">
          <Compass className="w-16 h-16 text-blue-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Discover Your Career Path</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Let our AI map out the high-level educational and professional milestones from where you are today to your dream role.
          </p>
        </div>
        <Button 
          onClick={generateCareerPath} 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold tracking-wide px-8 shadow-lg shadow-blue-500/20"
        >
          Generate Career Path
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="space-y-4 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 font-medium mb-3 tracking-wider text-sm">
            <Milestone className="w-5 h-5" /> MASTER CAREER TRAJECTORY
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {pathData.title}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            {pathData.description}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRegenerate}
          className="border-white/10 hover:bg-white/5 text-slate-300"
        >
          Regenerate Path
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:inset-0 before:ml-6 md:before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-slate-800 before:to-transparent">
        {pathData.steps.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === pathData.steps.length - 1;
          const Icon = isFirst ? GraduationCap : isLast ? Briefcase : Compass;

          return (
            <div key={idx} className="relative flex items-start group">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute -left-6 md:-left-10 w-12 h-12 rounded-full border-4 border-[#020617] flex items-center justify-center -translate-x-1/2 transition-colors duration-300",
                isLast ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-blue-900 group-hover:bg-blue-600 text-blue-300 group-hover:text-white"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content Card */}
              <Card className="flex-1 ml-6 bg-[#1E293B]/40 border-white/5 backdrop-blur-md group-hover:bg-[#1E293B]/60 group-hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-slate-400 uppercase tracking-widest">
                          Step {step.stepNumber}
                        </span>
                        {step.duration && (
                          <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-200 group-hover:text-white transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

    </div>
  )
}
