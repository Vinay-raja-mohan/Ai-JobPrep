
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { GraduationCap, ArrowRight, Mail, Lock, User, Sparkles, Rocket, Target, Zap } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast.success("Account created successfully!")
      router.push("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up")
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
          Build Your
          <br />
          Future With
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">AI Guidance.</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
          Join thousands of students who are accelerating their careers with personalized AI-powered roadmaps.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
          {[
            { icon: Rocket, value: "10K+", label: "Students" },
            { icon: Target, value: "95%", label: "Success Rate" },
            { icon: Zap, value: "24/7", label: "AI Mentor" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Sign Up Card */}
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
            <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
            <p className="text-slate-400">Start your transformation journey today</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 rounded-xl h-12"
                />
              </div>
            </div>
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
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
