
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Printer, Download } from "lucide-react"

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    education: [] as any[],
    experience: [] as any[],
    skills: [] as string[],
    projects: [] as any[]
  })

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const updateField = (field: string, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }]
    }))
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }]
    }))
  }

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", tech: "", description: "" }]
    }))
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">Build a professional resume in minutes.</p>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* EDITOR SECTION */}
        <div className="space-y-6 no-print h-[calc(100vh-200px)] overflow-y-auto pr-4">
          <Card>
            <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={resumeData.fullName} onChange={e => updateField("fullName", e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={resumeData.email} onChange={e => updateField("email", e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={resumeData.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+1 234 567 890" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn / Portfolio</Label>
                  <Input value={resumeData.linkedin} onChange={e => updateField("linkedin", e.target.value)} placeholder="linkedin.com/in/john" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea value={resumeData.summary} onChange={e => updateField("summary", e.target.value)} placeholder="A passionate developer..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button size="sm" variant="outline" onClick={addEducation}><Plus className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3 relative group">
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100" onClick={() => {
                    const newEdu = [...resumeData.education]
                    newEdu.splice(idx, 1)
                    updateField("education", newEdu)
                  }}><Trash2 className="w-4 h-4" /></Button>
                  <Input placeholder="School / University" value={edu.school} onChange={e => {
                    const newEdu = [...resumeData.education]
                    newEdu[idx].school = e.target.value
                    updateField("education", newEdu)
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Degree" value={edu.degree} onChange={e => {
                      const newEdu = [...resumeData.education]
                      newEdu[idx].degree = e.target.value
                      updateField("education", newEdu)
                    }} />
                    <Input placeholder="Year" value={edu.year} onChange={e => {
                      const newEdu = [...resumeData.education]
                      newEdu[idx].year = e.target.value
                      updateField("education", newEdu)
                    }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="React, Node.js, Python (Comma separated)" value={resumeData.skills.join(", ")} onChange={e => updateField("skills", e.target.value.split(", "))} />
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW SECTION */}
        <div className="border shadow-2xl bg-white text-black p-8 min-h-[1000px] print:w-full print:absolute print:top-0 print:left-0 print:m-0 print:z-50" ref={printRef}>
          {/* Header */}
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-3xl font-bold uppercase tracking-wide">{resumeData.fullName || "Your Name"}</h1>
            <div className="flex justify-center gap-4 text-sm mt-2 text-gray-600">
              {resumeData.email && <span>{resumeData.email}</span>}
              {resumeData.phone && <span>• {resumeData.phone}</span>}
              {resumeData.linkedin && <span>• {resumeData.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Summary</h2>
              <p className="text-sm text-gray-800 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && resumeData.skills[0] !== "" && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Skills</h2>
              <p className="text-sm text-gray-800">{resumeData.skills.join(" • ")}</p>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Education</h2>
              <div className="space-y-3">
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-sm">{edu.school}</h3>
                      <p className="text-sm italic">{edu.degree}</p>
                    </div>
                    <span className="text-sm font-medium">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .print-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
                }
            `}</style>
    </div>
  )
}
