
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      {children}
    </div>
  )
}
