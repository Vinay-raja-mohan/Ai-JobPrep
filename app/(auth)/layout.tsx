
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full scale-150 opacity-20"></div>
      {children}
    </div>
  )
}
