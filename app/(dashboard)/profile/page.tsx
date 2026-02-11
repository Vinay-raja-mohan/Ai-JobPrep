"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Save, Loader2, Settings, LogOut, Trash2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    university: "",
    graduationYear: "",
    bio: "",
    linkedin: "",
    github: ""
  })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const parsedUser = JSON.parse(stored)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || "",
        dob: parsedUser.dob ? new Date(parsedUser.dob).toISOString().split('T')[0] : "",
        gender: parsedUser.gender || "",
        phone: parsedUser.phone || "",
        university: parsedUser.university || "",
        graduationYear: parsedUser.graduationYear || "",
        bio: parsedUser.bio || "",
        linkedin: parsedUser.linkedin || "",
        github: parsedUser.github || ""
      })
    } else {
      router.push("/login")
    }
  }, [router])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          email: user.email,
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
          phone: formData.phone,
          university: formData.university,
          graduationYear: formData.graduationYear,
          bio: formData.bio,
          linkedin: formData.linkedin,
          github: formData.github
        }),
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) throw new Error("Failed to update profile")

      const data = await res.json()

      const updatedUser = { ...user, ...data.user }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      toast.success("Profile updated successfully! ✅")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" />
          Settings
        </h1>
        <p className="text-slate-400">Manage your account and personal information.</p>
      </div>

      <div className="space-y-8 bg-[#0B1120] p-6 rounded-2xl border border-slate-800">

        {/* Personal Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email Address</Label>
              <Input
                id="email"
                value={user.email}
                className="bg-[#1E293B]/50 border-slate-700 text-slate-400 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-slate-200">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-200">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(val) => setFormData({ ...formData, gender: val })}
              >
                <SelectTrigger className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: val });
                }}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
                placeholder="9876543210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university" className="text-slate-200">College / University</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
                placeholder="e.g. IIT Delhi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradYear" className="text-slate-200">Graduation Year</Label>
              <Input
                id="gradYear"
                value={formData.graduationYear}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setFormData({ ...formData, graduationYear: val });
                }}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
                placeholder="2025"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="text-slate-200">Short Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500 min-h-[100px]"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-slate-200">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-slate-200">GitHub Profile</Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="bg-[#1E293B] border-slate-700 text-white focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </div>

        {/* Account Actions */}
        <div className="space-y-4 pt-8 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-white">Account Actions</h2>
          <div className="bg-[#1E293B]/30 rounded-xl p-4 space-y-3 border border-red-900/20">
            <button
              onClick={() => {
                localStorage.removeItem("user")
                localStorage.removeItem("roadmap")
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                window.location.href = "/login"
              }}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-1 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>

            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  const stored = localStorage.getItem("user");
                  if (stored) {
                    const user = JSON.parse(stored);
                    try {
                      await fetch(`/api/user/delete?email=${user.email}`, { method: 'DELETE' });
                    } catch (e) {
                      console.error("Delete failed", e);
                    }
                  }

                  localStorage.clear();
                  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                  window.location.href = "/";
                }
              }}
              className="flex items-center gap-2 text-sm text-red-500/70 hover:text-red-500 px-1 transition-colors w-full text-left"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
