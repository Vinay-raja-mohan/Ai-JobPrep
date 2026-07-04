
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}></div>
      {children}
    </div>
  )
}
