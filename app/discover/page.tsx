"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Sparkles, Briefcase, MapPin, Target, ArrowRight } from "lucide-react"

interface CareerSuggestion {
  jobTitle: string;
  matchPercentage: number;
  whyItFits: string;
  coreSkill: string;
}

export default function DiscoverPathPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState("")
  const [interests, setInterests] = useState("")
  const [workStyle, setWorkStyle] = useState("")
  const [telegramId, setTelegramId] = useState("")
  const [educationStage, setEducationStage] = useState("")
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([])

  const isSchoolLevel = ["9th", "10th", "Intermediate"].includes(educationStage);

  const suggestedSkills = isSchoolLevel 
    ? ["Math", "Physics", "Chemistry", "Biology", "History", "Computer Science", "Arts", "Economics"]
    : ["Python", "JavaScript", "React", "Java", "Data Analysis", "UI/UX Design", "Public Speaking", "Problem Solving", "C++", "SQL"]
  
  const suggestedInterests = isSchoolLevel
    ? ["Space & Astronomy", "Building robots", "Drawing & Sketching", "Writing stories", "Business ideas", "Solving puzzles"]
    : ["Building visual things", "Working with data", "Leading teams", "Solving puzzles", "Writing content", "System architecture", "Interacting with users"]

  const addSkill = (skill: string) => {
    setSkills(prev => prev ? `${prev}, ${skill}` : skill)
  }

  const addInterest = (interest: string) => {
    setInterests(prev => prev ? `${prev}, ${interest}` : interest)
  }

  async function handleDiscover(e: React.FormEvent) {
    e.preventDefault()
    if (!skills || !interests || !workStyle) {
      toast.error("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const apiKey = localStorage.getItem("gemini_api_key");
      const headers: any = { "Content-Type": "application/json" };
      if (apiKey) headers["x-gemini-api-key"] = apiKey;

      const res = await fetch("/api/discover", {
        method: "POST",
        body: JSON.stringify({ skills, interests, workStyle, educationStage }),
        headers,
      })

      if (!res.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await res.json()
      setSuggestions(data.suggestions)
      toast.success("Career paths discovered!")
    } catch (error) {
      console.error(error)
      toast.error("Error discovering paths. Try again.")
    } finally {
      setLoading(false)
    }
  }

  async function selectCareer(suggestion: CareerSuggestion) {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      toast.error("User not found, please log in again")
      router.push("/login")
      return
    }
    const user = JSON.parse(userStr)
    const userEmail = user.email

    setLoading(true)
    const loadingToastId = toast.loading("Building your personalized AI Roadmap... 🚀")
    
    try {
      // 1. Update Profile automatically
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          email: userEmail,
          targetRole: suggestion.jobTitle,
          coreSkill: suggestion.coreSkill,
          educationStage,
          currentLevel: "Beginner",
          dailyStudyTime: 60,
          goalTimeline: "3 months",
          telegramChatId: telegramId || undefined
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Failed to update profile")
      const profileData = await res.json()
      localStorage.setItem("user", JSON.stringify(profileData.user))
      localStorage.setItem("discoveredRole", suggestion.jobTitle)
      localStorage.setItem("discoveredSkill", suggestion.coreSkill)
      localStorage.setItem("discoveredStage", educationStage)

      // 2. Generate Roadmap
      const apiKey = localStorage.getItem("gemini_api_key");
      const headers: any = { "Content-Type": "application/json" };
      if (apiKey) headers["x-gemini-api-key"] = apiKey;

      const genRes = await fetch("/api/roadmap/generate", {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
        headers: headers,
      })

      if (!genRes.ok) throw new Error("Failed to generate roadmap")

      // 3. Generate Career Path Cache
      toast.loading("Generating your high-level Career Path... 🧭", { id: loadingToastId })
      try {
        const cpRes = await fetch("/api/career-path/generate", {
          method: "POST",
          body: JSON.stringify({ 
            educationStage, 
            targetRole: suggestion.jobTitle, 
            coreSkill: suggestion.coreSkill 
          }),
          headers: headers,
        })
        if (cpRes.ok) {
          const cpData = await cpRes.json()
          localStorage.setItem(`careerPath_${userEmail}`, JSON.stringify(cpData.path))
        }
      } catch (cpErr) {
        console.warn("Failed to generate career path pre-cache:", cpErr)
      }
      
      toast.dismiss(loadingToastId)
      toast.success("Roadmap generated successfully!")
      router.push("/dashboard")
      
    } catch (error: any) {
      toast.dismiss(loadingToastId)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-2 backdrop-blur-md">
            <Sparkles className="w-4 h-4 mr-2" /> AI Career Recommender
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Discover Your Ideal Path</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Tell us what you're good at and what you enjoy. Our AI will analyze the Indian job market and suggest high-growth careers tailored for you.
          </p>
        </div>

        {suggestions.length === 0 ? (
          <Card className="bg-[#1E293B]/80 border-white/5 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Your Profile Profile</CardTitle>
              <CardDescription className="text-slate-400">Let's find the intersection of your skills and passions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDiscover} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Current Education Stage</Label>
                  <Select onValueChange={setEducationStage} value={educationStage}>
                    <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                      <SelectValue placeholder="Select your education stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                      <SelectItem value="9th">9th Class</SelectItem>
                      <SelectItem value="10th">10th Class</SelectItem>
                      <SelectItem value="Intermediate">Intermediate (11th/12th)</SelectItem>
                      <SelectItem value="B.Tech">B.Tech / Degree (IT or Core)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-slate-300">
                    {isSchoolLevel ? "Your Favorite Subjects" : "Your Skills (Tools, Languages, Soft Skills)"}
                  </Label>
                  <Input 
                    id="skills" 
                    placeholder={isSchoolLevel ? "e.g. Math, Science, History" : "e.g. Python, Communication, UI Design, Math"} 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-[#0F172A] border-slate-700 text-white"
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {suggestedSkills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-purple-500/20 hover:text-purple-300 border-slate-700 text-slate-400 transition-colors"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-slate-300">Your Interests & Passions</Label>
                  <Textarea 
                    id="interests" 
                    placeholder="e.g. Building visual things, working with data, leading teams, solving puzzles" 
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="bg-[#0F172A] border-slate-700 text-white min-h-[100px]"
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {suggestedInterests.map(interest => (
                      <Badge 
                        key={interest} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-purple-500/20 hover:text-purple-300 border-slate-700 text-slate-400 transition-colors"
                        onClick={() => addInterest(interest)}
                      >
                        + {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Preferred Work Environment (Indian Context)</Label>
                  <Select onValueChange={setWorkStyle} value={workStyle}>
                    <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                      <SelectValue placeholder="Select work style" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                      <SelectItem value="Startup Hustle (High Growth, Fast Pace)">Startup Hustle (High Growth, Fast Pace)</SelectItem>
                      <SelectItem value="MNC Stability (Structured, Work-Life Balance)">MNC / Service-Based IT (Structured)</SelectItem>
                      <SelectItem value="Product Based / GCC (High Tech, Compensation Focus)">Product Based / GCCs (Tech Focused)</SelectItem>
                      <SelectItem value="Remote / Freelance">Remote / Freelance (Flexible)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <Label htmlFor="telegram" className="text-slate-300 flex items-center gap-2">
                    Telegram Chat ID (Optional) 
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px] py-0">For AI Mentor Reminders</Badge>
                  </Label>
                  <p className="text-xs text-slate-500">Message <a href="https://t.me/userinfobot" target="_blank" className="text-blue-400 hover:underline">@userinfobot</a> on Telegram to get your ID.</p>
                  <Input 
                    id="telegram" 
                    placeholder="e.g. 123456789" 
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value)}
                    className="bg-[#0F172A] border-slate-700 text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6 text-lg font-semibold shadow-lg shadow-purple-900/20" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center"><Sparkles className="animate-spin mr-2 h-5 w-5" /> Analyzing Market...</span>
                  ) : "Discover My Path 🚀"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
              <Button variant="outline" onClick={() => setSuggestions([])} className="border-slate-700 text-slate-300 hover:text-white hover:bg-white/10">
                Retake Assessment
              </Button>
            </div>
            
            <div className="flex flex-col gap-6">
              {suggestions.map((suggestion, idx) => (
                <Card key={idx} className="bg-[#1E293B]/80 border-white/5 backdrop-blur-xl shadow-xl hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start md:items-center">
                        <CardTitle className="text-xl md:text-2xl text-white flex items-center gap-2">
                          <Briefcase className="h-6 w-6 text-purple-400" />
                          {suggestion.jobTitle}
                        </CardTitle>
                        <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20 flex items-center">
                          <Target className="w-4 h-4 mr-1" /> {suggestion.matchPercentage}% Match
                        </div>
                      </div>
                      <p className="text-slate-300 text-base leading-relaxed border-l-2 border-purple-500/50 pl-4 py-1 italic">
                        "{suggestion.whyItFits}"
                      </p>
                    </div>
                    <div className="md:w-64 shrink-0 flex items-center">
                      <Button 
                        onClick={() => selectCareer(suggestion)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6"
                      >
                        Select & Build Roadmap <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
