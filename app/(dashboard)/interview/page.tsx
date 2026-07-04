"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Bot, User, Send, Loader2, PlayCircle, Star, Volume2, VolumeX, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Message = {
  role: 'user' | 'ai';
  content: string;
  feedback?: string | null;
  score?: number | null;
}

export default function AIInterviewPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [email, setEmail] = useState("")
  
  const [soundEnabled, setSoundEnabled] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const userObj = JSON.parse(userStr)
      setEmail(userObj.email)
    } else {
      toast.error("Please login first")
      router.push("/dashboard")
    }
    
    // Stop any speech when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speakText = (text: string) => {
    if (!soundEnabled) return;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices.find(v => v.lang.includes('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  const startInterview = async (userEmail: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": localStorage.getItem("gemini_api_key") || ""
        },
        body: JSON.stringify({
          email: userEmail,
          currentAnswer: "",
          history: []
        })
      })

      const data = await res.json()
      
      if (res.ok && data.nextQuestion) {
        setMessages([{ role: 'ai', content: data.nextQuestion }])
        speakText(data.nextQuestion)
      } else {
        toast.error(data.error || "Failed to start interview")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || loading || isComplete) return

    const userMessage = input.trim()
    setInput("") // clear input early for UX
    
    // Optimistically add user message
    const newHistory: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newHistory)
    
    // Cancel speech if user interrupts
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setLoading(true)

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": localStorage.getItem("gemini_api_key") || ""
        },
        body: JSON.stringify({
          email: email,
          currentAnswer: userMessage,
          history: newHistory.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await res.json()

      if (res.ok) {
        // We received feedback, score, and the next question
        const aiMessage: Message = {
          role: 'ai',
          content: data.nextQuestion || "Thank you. This concludes our interview.",
          feedback: data.feedback,
          score: data.score
        }
        
        setMessages(prev => [...prev, aiMessage])
        
        if (data.isComplete || !data.nextQuestion) {
          setIsComplete(true)
        }
        
        // Speak feedback + next question
        const speechText = `${data.feedback ? data.feedback + ". " : ""}${data.nextQuestion || "This concludes our interview. Good job!"}`;
        speakText(speechText);
        
      } else {
        toast.error(data.error || "Failed to submit answer")
        // Remove optimistic user message on failure
        setMessages(messages)
        setInput(userMessage)
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error")
      setMessages(messages)
      setInput(userMessage)
    } finally {
      setLoading(false)
    }
  }

  const averageScore = messages
    .filter(m => m.score)
    .reduce((acc, curr, _, arr) => acc + (curr.score || 0) / arr.length, 0)

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">AI Interviewer</h1>
            <p className="text-xs text-slate-400">Technical & Behavioral Assessment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {messages.some(m => m.score) && (
            <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-full border border-white/5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">Avg Score: {averageScore.toFixed(1)}/10</span>
            </div>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleSound} className={soundEnabled ? "text-blue-400" : "text-slate-500"}>
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center border-2 border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
              <Bot className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Ready for your interview?</h2>
              <p className="text-slate-400 max-w-md mx-auto">The AI will ask you technical and behavioral questions tailored to your profile.</p>
            </div>
            <Button 
              onClick={() => startInterview(email)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Start Interview
            </Button>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            
            {/* Avatar */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-blue-600/20 border border-blue-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>
            
            {/* Message Bubble */}
            <div className={`space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Feedback Card (if exists) */}
              {msg.feedback && (
                <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl rounded-tl-none shadow-lg max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation</span>
                    {msg.score && (
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                        msg.score >= 8 ? 'bg-green-500/20 text-green-400' : 
                        msg.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        Score: {msg.score}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{msg.feedback}</p>
                </div>
              )}

              {/* Main Text Content */}
              <div className={`p-4 rounded-2xl shadow-lg max-w-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-[#1E293B] border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>

          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-4xl mr-auto animate-pulse">
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
            <div className="bg-[#1E293B] p-4 rounded-2xl rounded-tl-none w-32 h-12 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      {messages.length > 0 && (
        <div className="shrink-0 bg-[#0F172A] border-t border-white/5 p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <Textarea 
              placeholder={isComplete ? "Interview completed." : "Type your answer here... Take your time."}
              className="resize-none bg-[#1E293B] border-slate-700 focus-visible:ring-blue-500 text-slate-200 pr-16 min-h-[60px] max-h-[200px] rounded-xl"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || isComplete}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={!input.trim() || loading || isComplete}
              className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-500 w-10 h-10 p-0 rounded-lg shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500">
              {isComplete 
                ? "You can review your feedback above." 
                : "Press Enter to submit, Shift + Enter for new line. The AI will speak automatically."}
            </p>
          </div>
        </div>
      )}
      
    </div>
  )
}
