
"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowLeft, BookOpen, Brain, CheckCircle, ChevronRight, Loader2,
  Globe, AlertTriangle, Lightbulb, Info, HelpCircle, Menu, RefreshCcw, Terminal
} from "lucide-react"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Interface for structured JSON response
interface LearningContent {
  title: string;
  introduction: string;
  keyMatches: { title: string; description: string }[];
  realWorldUses?: { title: string; description: string }[];
  callouts: { type: 'warning' | 'tip' | 'info'; title: string; content: string }[];
  faq: { question: string; answer: string }[];
}

export default function LearnTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topic = decodeURIComponent(params.topic as string)
  const [content, setContent] = useState<LearningContent | null>(null)
  const [loading, setLoading] = useState(true)

  // Refs for scrolling to sections
  const introRef = useRef<HTMLDivElement>(null)
  const conceptsRef = useRef<HTMLDivElement>(null)
  const usesRef = useRef<HTMLDivElement>(null)
  const tipsRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (topic) {
      fetchContent()
    }
  }, [topic])

  const fetchContent = async (force = false) => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user ? user.email : null;

      const res = await fetch("/api/learn/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": localStorage.getItem("gemini_api_key") || ""
        },
        body: JSON.stringify({ topic, email, force }),
      })
      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
      } else if (data.title) {
        // Valid JSON response
        setContent(data)
      } else {
        toast.error("Invalid response format")
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error fetching content")
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    fetchContent(true)
  }

  const getQuizPath = () => {
    const lowerTopic = topic.toLowerCase();
    if (['dsa', 'array', 'linked list', 'tree', 'graph', 'dynamic programming'].some(k => lowerTopic.includes(k))) {
      return `/dsa/practice?topic=${encodeURIComponent(topic)}`
    }
    return `/aptitude/practice?topic=${encodeURIComponent(topic)}`
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617] text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 animate-pulse">Designing structured curriculum...</p>
      </div>
    </div>
  )

  if (!content) return (
    <div className="flex h-screen items-center justify-center text-white">
      <p>Failed to load content. Please try again.</p>
      <Button onClick={() => window.location.reload()} className="ml-4">Retry</Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-20">
      {/* Navigation Bar / Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {content.title}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Regenerate
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 grid grid-cols-1 xl:grid-cols-4 gap-10">

        {/* === MAIN CONTENT (Left Col) === */}
        <div className="xl:col-span-3 space-y-12">

          {/* 1. Introduction Section */}
          <div ref={introRef} className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">Introduction</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-4xl">
              {content.introduction}
            </p>
          </div>

          {/* 2. Key Concepts Grid (The 3-Col Matrix) */}
          <div ref={conceptsRef} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" /> Key Concepts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.keyMatches?.map((item, i) => (
                <Card key={i} className="bg-[#0F172A] border-slate-800 hover:border-slate-600 transition-all group">
                  <CardHeader>
                    <CardTitle className="text-blue-400 group-hover:text-blue-300 transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 3. Real World Uses Grid (Replaces Code) */}
          <div ref={usesRef} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-400" /> Real World Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.realWorldUses?.map((item, i) => (
                <Card key={i} className="bg-[#0F172A]/50 border-slate-800 hover:bg-[#1E293B]/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-green-400">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 4. Callouts (Warnings & Tips) */}
          <div ref={tipsRef} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" /> Critical Points
            </h3>
            <div className="space-y-4">
              {content.callouts?.map((callout, i) => {
                let borderColor = "border-blue-500/20 bg-blue-500/5 text-blue-200";
                let icon = <Info className="w-5 h-5 text-blue-400" />;

                if (callout.type === 'warning') {
                  borderColor = "border-red-500/20 bg-red-500/5 text-red-200";
                  icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
                } else if (callout.type === 'tip') {
                  borderColor = "border-green-500/20 bg-green-500/5 text-green-200";
                  icon = <CheckCircle className="w-5 h-5 text-green-400" />;
                }

                return (
                  <div key={i} className={`flex gap-4 p-4 rounded-lg border ${borderColor}`}>
                    <div className="shrink-0 mt-1">{icon}</div>
                    <div>
                      <h4 className="font-bold mb-1">{callout.title}</h4>
                      <p className="text-sm opacity-90">{callout.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 5. FAQ Accordion */}
          <div ref={faqRef} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-400" /> Common Questions
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {content.faq?.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-slate-800 rounded-lg px-2 bg-[#0F172A]/50">
                  <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline px-2">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 px-2 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>

        {/* === SIDEBAR (Right Col - Sticky) === */}
        <div className="hidden xl:block col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="bg-[#1E293B]/30 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500">On this page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button onClick={() => scrollToSection(introRef)} className="block text-sm text-slate-400 hover:text-blue-400 transition-colors text-left w-full">Introduction</button>
                <button onClick={() => scrollToSection(conceptsRef)} className="block text-sm text-slate-400 hover:text-blue-400 transition-colors text-left w-full">Key Concepts</button>
                <button onClick={() => scrollToSection(usesRef)} className="block text-sm text-slate-400 hover:text-blue-400 transition-colors text-left w-full">Applications</button>
                <button onClick={() => scrollToSection(tipsRef)} className="block text-sm text-slate-400 hover:text-blue-400 transition-colors text-left w-full">Critical Points</button>
                <button onClick={() => scrollToSection(faqRef)} className="block text-sm text-slate-400 hover:text-blue-400 transition-colors text-left w-full">FAQ</button>
              </CardContent>
            </Card>

            {(!params.type && !window.location.search.includes('type=core')) && (
              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-white/10">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Ready to test?</h3>
                  <p className="text-sm text-slate-400">
                    Validate your understanding of {content.title} with a quick quiz.
                  </p>
                  <Button onClick={() => router.push(getQuizPath())} className="w-full bg-blue-600 hover:bg-blue-500">
                    {getQuizPath().includes('/dsa/') ? (
                      <>Start Coding <Terminal className="w-4 h-4 ml-2" /></>
                    ) : (
                      <>Start Quiz <ChevronRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
