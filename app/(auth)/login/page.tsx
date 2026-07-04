
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { GraduationCap, ArrowRight, Mail, Lock, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Store user info in localStorage for this prototype
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Login successful!")

      // Redirect based on if profile is complete
      if (!data.user.targetRole) {
        router.push("/discover")
      } else {
        router.push("/dashboard")
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-0 mx-4">
      
      {/* Left Side: Hero Branding */}
      <div className="hidden md:flex flex-col justify-center items-start p-12 relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">AI Career Prep</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
          Your Dream
          <br />
          Career Starts
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Right Here.</span>
        </h1>
        
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
          AI-powered roadmaps, mentorship, and tracking — personalized to your unique career journey.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3">
          {["AI Roadmaps", "Smart Resume", "Career Path", "Daily Missions"].map((feat) => (
            <div key={feat} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {feat}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-[#0F172A]/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/40">
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-bold">AI Career Prep</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to continue your preparation</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 rounded-xl h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 rounded-xl h-12"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
