
"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { ApiKeyDialog } from "@/components/ApiKeyDialog"

const formSchema = z.object({
  educationStage: z.enum(["9th", "10th", "Intermediate", "B.Tech"]),
  targetRole: z.string().min(1, "Please enter a target role."),
  coreSkill: z.string().min(1, "Please enter a core skill."),
  currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  dailyStudyTime: z.number().min(15).max(480),
  goalTimeline: z.enum(["3 months", "6 months"]),
})

function ProfileSetupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Hydrate user from localstorage
    const stored = localStorage.getItem("user")
    if (stored) {
      const user = JSON.parse(stored)
      setUserEmail(user.email)
    } else {
      router.push("/login")
    }
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationStage: "B.Tech",
      targetRole: "",
      coreSkill: "",
      dailyStudyTime: 60,
    },
  })

  useEffect(() => {
    // Hydrate AI suggestions if available
    const role = localStorage.getItem("discoveredRole")
    const skill = localStorage.getItem("discoveredSkill")
    const stage = localStorage.getItem("discoveredStage")
    if (role) form.setValue("targetRole", role)
    if (skill) form.setValue("coreSkill", skill)
    if (stage) form.setValue("educationStage", stage as any)
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (!userEmail) throw new Error("User not identified")

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          email: userEmail,
          ...values
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await res.json()

      // Update local user data
      localStorage.setItem("user", JSON.stringify(data.user))

      // Trigger Roadmap Generation
      const apiKey = localStorage.getItem("gemini_api_key");
      const headers: any = { "Content-Type": "application/json" };
      if (apiKey) headers["x-gemini-api-key"] = apiKey;

      const genRes = await fetch("/api/roadmap/generate", {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
        headers: headers,
      })

      if (!genRes.ok) {
        const errorData = await genRes.json();
        console.error("Roadmap generation failed:", errorData);
        throw new Error(errorData.error || "Roadmap generation failed");
      }

      toast.success("Profile setup complete! Redirecting...")
      // Navigate to Dashboard (where roadmap generation will trigger or be shown)
      router.push("/dashboard")

    } catch (error: any) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full scale-150 opacity-20"></div>

      <Card className="w-full max-w-lg bg-[#1E293B]/80 border-white/5 backdrop-blur-xl shadow-2xl relative z-10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Setting Up Your AI Mentor</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Tell us about your goals so we can generate the perfect roadmap for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="educationStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Education Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                          <SelectValue placeholder="Select your education stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                        <SelectItem value="9th">9th Class</SelectItem>
                        <SelectItem value="10th">10th Class</SelectItem>
                        <SelectItem value="Intermediate">Intermediate (11th/12th)</SelectItem>
                        <SelectItem value="B.Tech">B.Tech / Degree</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Target Job Role</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Frontend Developer" 
                        {...field} 
                        className="bg-[#0F172A] border-slate-700 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coreSkill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Primary Tech Stack / Skill</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. React / Next.js" 
                        {...field} 
                        className="bg-[#0F172A] border-slate-700 text-white" 
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      We'll focus your core learning modules on this.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-slate-300">Current Skill Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={level} className="border-slate-500 text-blue-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-300 cursor-pointer">
                              {level}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyStudyTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Daily Study Time: {field.value} minutes</FormLabel>
                    <FormControl>
                      <Slider
                        min={15}
                        max={300}
                        step={15}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Be realistic! Consistency &gt; Intensity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goalTimeline"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-slate-300">Goal Timeline</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="3 months" className="border-slate-500 text-blue-500" />
                          </FormControl>
                          <FormLabel className="font-normal text-slate-300">
                            3 Months
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="6 months" className="border-slate-500 text-blue-500" />
                          </FormControl>
                          <FormLabel className="font-normal text-slate-300">
                            6 Months
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 shadow-lg shadow-blue-900/20" disabled={loading}>
                {loading ? "Generating Roadmap..." : "Generate AI Plan 🚀"}
              </Button>

              <div className="flex justify-center">
                <ApiKeyDialog
                  trigger={<span className="text-xs text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">I have my own Gemini API Key</span>}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Loading...</div>}>
      <ProfileSetupForm />
    </Suspense>
  )
}
