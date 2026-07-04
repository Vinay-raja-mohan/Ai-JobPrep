
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Target, Trophy, Clock, Sparkles, GraduationCap, Map, Bot, FileText, Milestone, Bell, Video, Brain, Zap, Users, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="px-6 lg:px-16 h-20 flex items-center justify-between border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-white font-bold">AI Career Prep</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="#for-everyone" className="hover:text-white transition-colors">For Everyone</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 rounded-xl">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* ========== HERO SECTION ========== */}
        <section className="pt-12 lg:pt-16 pb-10 px-6 lg:px-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 mr-2 fill-blue-400 text-blue-400" />
            AI-Powered Career Accelerator for Every Student
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Your Entire Career
            <br />
            Journey, <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Mapped by AI.</span>
          </h1>

          <p className="text-base lg:text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
            From 9th grade to your dream job — personalized roadmaps, daily missions, AI mentorship, smart resume building, and Telegram notifications. All in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] rounded-xl w-full sm:w-auto">
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="h-12 px-8 text-sm border-white/10 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl w-full sm:w-auto">
                <Sparkles className="mr-2 h-5 w-5 text-purple-400" /> Discover My Path
              </Button>
            </Link>
          </div>
        </section>

        {/* ========== FEATURES GRID ========== */}
        <section id="features" className="pt-6 pb-20 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Features</span>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mt-2 mb-3">Everything You Need to Succeed</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">One platform that adapts to your career — whether you&apos;re aiming for engineering, medicine, or anything in between.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Map className="h-6 w-6 text-blue-400" />}
                title="AI-Generated Roadmaps"
                description="Day-by-day, week-by-week study plans personalized to your target role, skill level, and timeline."
                color="blue"
              />
              <FeatureCard
                icon={<Milestone className="h-6 w-6 text-cyan-400" />}
                title="Career Path Generator"
                description="See your entire trajectory mapped out — from school to your dream job with every milestone in between."
                color="cyan"
              />
              <FeatureCard
                icon={<Bot className="h-6 w-6 text-green-400" />}
                title="AI Mentor Chat"
                description="Context-aware chatbot that knows your roadmap and gives advice tailored to your exact progress."
                color="green"
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-yellow-400" />}
                title="Smart Resume Builder"
                description="AI rewrites your career objective to beat ATS systems. Export clean, professional PDFs instantly."
                color="yellow"
              />
              <FeatureCard
                icon={<Bell className="h-6 w-6 text-orange-400" />}
                title="Telegram Notifications"
                description="Get congratulated on Telegram when you finish daily tasks. Demo session bookings notify you instantly."
                color="orange"
              />
              <FeatureCard
                icon={<Video className="h-6 w-6 text-purple-400" />}
                title="Book Demo Sessions"
                description="Schedule one-on-one career guidance sessions with mentors directly from your dashboard."
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section id="how-it-works" className="py-24 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">How It Works</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">Three Steps to Your Dream Career</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Goal",
                  desc: "Choose your education stage (9th, 10th, Intermediate, B.Tech) and your dream career — IT or non-IT.",
                  icon: Target,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  step: "02",
                  title: "AI Builds Your Plan",
                  desc: "Our AI generates a complete roadmap with daily tasks, career trajectories, and personalized resources.",
                  icon: Brain,
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  step: "03",
                  title: "Learn, Track & Grow",
                  desc: "Complete daily missions, build streaks, earn badges, and get Telegram notifications celebrating your wins.",
                  icon: Trophy,
                  gradient: "from-orange-500 to-yellow-500"
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-8 hover:border-white/15 transition-all duration-300 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-5xl font-black text-white/5 absolute top-6 right-6">{item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FOR EVERYONE ========== */}
        <section id="for-everyone" className="py-24 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Inclusive Design</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">Built for Every Student</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Whether you want to be a Software Engineer, Doctor, or Architect — the platform adapts to your field.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-[#0F172A] border border-blue-500/15 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">IT & Tech Students</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">Full DSA, Aptitude, and Core Skill tracks. Tailored for Software Engineers, Data Scientists, DevOps, and more.</p>
                <div className="flex flex-wrap gap-2">
                  {["DSA Practice", "Aptitude Quizzes", "Core Skills", "AI Interview Prep"].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/30 to-[#0F172A] border border-emerald-500/15 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Non-IT & School Students</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">DSA and Aptitude are automatically hidden. Focus on core subjects, career path planning, and foundational knowledge.</p>
                <div className="flex flex-wrap gap-2">
                  {["Core Subjects", "Career Trajectories", "AI Mentor", "Resume Builder"].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA ========== */}
        <section className="py-24 px-6 lg:px-16">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-900/40 via-[#0F172A] to-purple-900/40 border border-white/10 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Ready to Accelerate
                <br />Your Career?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of students who are turning their ambitions into actionable plans with AI.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-12 text-base bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xl shadow-blue-600/25 rounded-xl transition-all hover:scale-[1.02]">
                  Get Started — It&apos;s Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-10 text-center text-sm text-slate-500 border-t border-white/5 bg-[#020617]">
        <p>© 2026 AI Career Prep. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: any = {
    blue: "border-blue-500/15 hover:border-blue-500/40",
    cyan: "border-cyan-500/15 hover:border-cyan-500/40",
    green: "border-green-500/15 hover:border-green-500/40",
    yellow: "border-yellow-500/15 hover:border-yellow-500/40",
    orange: "border-orange-500/15 hover:border-orange-500/40",
    purple: "border-purple-500/15 hover:border-purple-500/40",
  }

  const iconBgMap: any = {
    blue: "bg-blue-500/10",
    cyan: "bg-cyan-500/10",
    green: "bg-green-500/10",
    yellow: "bg-yellow-500/10",
    orange: "bg-orange-500/10",
    purple: "bg-purple-500/10",
  }

  return (
    <div className={`p-6 rounded-2xl border bg-[#0F172A]/80 hover:bg-[#1E293B]/50 transition-all duration-300 group ${colorMap[color]}`}>
      <div className={`mb-5 p-3 w-fit rounded-xl ${iconBgMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
