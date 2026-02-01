
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

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
    <Card className="w-full max-w-4xl bg-[#1E293B]/80 border-white/5 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden text-white grid md:grid-cols-2">
      {/* Left Side: Coding Visual */}
      <div className="hidden md:flex flex-col justify-center p-8 bg-[#0F172A] border-r border-white/5 relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
        <div className="relative z-10 font-mono text-sm leading-relaxed">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-slate-400">
            <span className="text-purple-400">const</span> <span className="text-blue-300">newDeveloper</span> = <span className="text-purple-400">new</span> <span className="text-yellow-300">Career</span>();
          </div>
          <div className="pl-0 mt-2 text-slate-400">
            <span className="text-blue-400">function</span> <span className="text-yellow-300">initProfile</span>() {"{"}
          </div>
          <div className="pl-4 text-slate-400">
            <span className="text-blue-300">newDeveloper</span>.<span className="text-yellow-300">setGoals</span>([<span className="text-green-400">"FAANG"</span>, <span className="text-green-400">"Startup"</span>]);
          </div>
          <div className="pl-4 text-slate-400">
            <span className="text-blue-300">newDeveloper</span>.<span className="text-yellow-300">startGrind</span>();
          </div>
          <div className="pl-0 text-slate-400">{"}"}</div>

          <div className="mt-4 text-slate-500">{"// Output:"}</div>
          <div className="text-green-400 font-bold">{"> Current Status: Hired! 🚀"}</div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="p-8 flex flex-col justify-center">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Start your transformation today
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dev@example.com"
                required
                className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input id="password" name="password" type="password" required className="bg-[#0F172A] border-slate-700 text-white focus-visible:ring-blue-500" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 shadow-lg shadow-blue-900/20" disabled={loading}>
              {loading ? "Creating..." : "Initialize Account"}
            </Button>
            <Button variant="outline" className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">
              Sign up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="underline text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
