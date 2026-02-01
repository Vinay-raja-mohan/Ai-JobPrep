
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

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
        router.push("/profile-setup")
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
            <span className="text-purple-400">class</span> <span className="text-yellow-300">Developer</span> <span className="text-purple-400">extends</span> <span className="text-yellow-300">User</span> {"{"}
          </div>
          <div className="pl-4 text-slate-400">
            <span className="text-blue-400">constructor</span>() {"{"}
          </div>
          <div className="pl-8 text-slate-400">
            <span className="text-red-400">this</span>.<span className="text-blue-300">dreamJob</span> = <span className="text-green-400">true</span>;
          </div>
          <div className="pl-8 text-slate-400">
            <span className="text-red-400">this</span>.<span className="text-blue-300">skills</span> = [<span className="text-green-400">"DSA"</span>, <span className="text-green-400">"System Design"</span>];
          </div>
          <div className="pl-4 text-slate-400">
            {"}"}
          </div>
          <div className="pl-4 mt-2 text-slate-400">
            <span className="text-blue-400">async</span> <span className="text-yellow-300">login</span>() {"{"}
          </div>
          <div className="pl-8 text-slate-400">
            <span className="text-purple-400">await</span> <span className="text-blue-300">JobPrepAI</span>.<span className="text-yellow-300">boostCareer</span>();
          </div>
          <div className="pl-4 text-slate-400">
            {"}"}
          </div>
          <div className="text-slate-400">{"}"}</div>
        </div>
        <div className="mt-8">
          <p className="text-slate-400 text-sm font-medium">Turn lines of code into</p>
          <p className="text-white text-xl font-bold mt-1">Offer Letters 🚀</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="p-8 flex flex-col justify-center">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Resume your preparation journey
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={onSubmit} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline text-blue-400 hover:text-blue-300">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-[#0F172A] border-slate-700 text-white focus-visible:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 shadow-lg shadow-blue-900/20" disabled={loading}>
              {loading ? "Compiling..." : "Run Login()"}
            </Button>
            <Button variant="outline" className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
