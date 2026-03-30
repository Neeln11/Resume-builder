"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WizardWrapper from "@/components/resume-builder/form/wizard-wrapper";
import ResumePreview from "@/components/resume-builder/preview/resume-preview";
import { ResumeData, defaultResumeData } from "@/lib/schema";
import { ProfileHeader } from "@/components/auth/profile-header";
import { HistoryModal } from "@/components/resume-builder/history-modal";
import Link from "next/link";

export default function BuilderPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load resume from session storage if we came from the dashboard "Edit" button
  useEffect(() => {
    const editId = sessionStorage.getItem("editResumeId");
    const editData = sessionStorage.getItem("editResumeData");
    if (editId && editData) {
      try {
        setActiveResumeId(editId);
        setResumeData(JSON.parse(editData));
      } catch (e) {
        console.error("Failed to parse session resume:", e);
      } finally {
        sessionStorage.removeItem("editResumeId");
        sessionStorage.removeItem("editResumeData");
      }
    }
  }, []);

  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleReset = () => {
    setResumeData(defaultResumeData);
    setActiveResumeId(null);
    router.push("/dashboard");
  };

  const handleLoadResume = (id: string, data: ResumeData) => {
    setActiveResumeId(id);
    setResumeData(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 print:bg-white relative z-0">

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on md+)
          Full-height, tab-switched view: [Edit Form] | [Preview]
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col h-screen w-full bg-white overflow-hidden">
        {/* Mobile Header */}
        <header className="px-4 py-4 border-b border-slate-100 bg-white flex justify-between items-center shrink-0 z-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              RB
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Resume<span className="text-slate-500 font-medium">Builder</span>
            </span>
          </Link>
          <ProfileHeader onOpenHistory={() => setIsHistoryOpen(true)} />
        </header>

        {/* Mobile Tab bar */}
        <MobileBuilder
          resumeData={resumeData}
          activeResumeId={activeResumeId}
          handleDataChange={handleDataChange}
          handleReset={handleReset}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below md) — COMPLETELY UNCHANGED
          Side-by-side: Form (left) | Live Preview (right)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row h-screen">
        {/* Left side: Form Wizard */}
        <section className="w-full md:w-[45%] lg:w-[40%] bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 print:hidden">
          <header className="px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                  RB
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                  Resume<span className="text-slate-500 font-medium">Builder</span>
                </h1>
              </Link>
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
                Home
              </Link>
            </div>
            <ProfileHeader onOpenHistory={() => setIsHistoryOpen(true)} />
          </header>

          <div className="flex-1 overflow-hidden p-6 lg:p-8">
            <WizardWrapper
              key={activeResumeId || "new"}
              initialData={resumeData}
              resumeId={activeResumeId}
              onDataChange={handleDataChange}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Right side: Live Preview Pane */}
        <section className="flex-1 bg-slate-100 flex flex-col h-screen overflow-hidden print:bg-white print:overflow-visible relative">
          <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 shrink-0 print:hidden shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Live Preview</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Template:</span>
              <select
                value={resumeData.template || "default"}
                onChange={(e) => handleDataChange({ ...resumeData, template: e.target.value })}
                className="text-sm border border-slate-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="default">Standard Professional</option>
                <option value="minimal">Clean Minimalist</option>
                <option value="creative">Modern Creative</option>
              </select>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 print:p-0 flex justify-center items-start">
            <div className="w-full flex justify-center print:static">
              <div id="resume-a4-container" className="w-full max-w-[210mm] aspect-[210/297] bg-white transition-all duration-300 ease-in-out shadow-2xl rounded-sm overflow-hidden print:shadow-none print:rounded-none">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        onSelect={handleLoadResume}
      />

      {/* 
        OFF-SCREEN PDF CAPTURE CONTAINER
        This ensures html-to-image always has a fully-rendered, perfectly sized A4 DOM node
        to capture, regardless of whether the user is on mobile (tabs) or desktop.
        Tucked neatly behind the main background so it's technically on-screen but entirely invisible,
        preventing 'html-to-image' from silently hanging when dealing with unpainted massive off-screen coordinates.
        Wrapped in a 0x0 overflow-hidden box to prevent the 1123px height from causing the main page to scroll.
      */}
      <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-100 pointer-events-none z-[-1] print:hidden">
        <div id="pdf-resume-capture" className="w-[794px] h-[1123px] bg-white text-base">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </main>
  );
}

// ─── Mobile-only tab switcher component ──────────────────────────────────────
interface MobileBuilderProps {
  resumeData: ResumeData;
  activeResumeId: string | null;
  handleDataChange: (data: ResumeData) => void;
  handleReset: () => void;
}

function MobileBuilder({ resumeData, activeResumeId, handleDataChange, handleReset }: MobileBuilderProps) {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div className="flex w-full border-b border-slate-200 shrink-0 bg-white">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "form"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          ✏️ Edit Form
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "preview"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {/* Form panel */}
      <div className={`flex-1 overflow-y-auto p-4 ${activeTab === "form" ? "" : "hidden"}`}>
        <WizardWrapper
          key={activeResumeId || "new"}
          initialData={resumeData}
          resumeId={activeResumeId}
          onDataChange={handleDataChange}
          onReset={handleReset}
        />
      </div>

      {/* Preview panel */}
      <div className={`flex-1 overflow-y-auto bg-slate-100 p-4 ${activeTab === "preview" ? "" : "hidden"}`}>
        {/* Template switcher */}
        <div className="flex items-center justify-between mb-3 bg-white rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Template</span>
          <select
            value={resumeData.template || "default"}
            onChange={(e) => handleDataChange({ ...resumeData, template: e.target.value })}
            className="text-xs border border-slate-200 rounded-md py-1.5 pl-2 pr-6 bg-white cursor-pointer"
          >
            <option value="default">Standard Professional</option>
            <option value="minimal">Clean Minimalist</option>
            <option value="creative">Modern Creative</option>
          </select>
        </div>
        <div className="flex justify-center">
          <div
            id="resume-a4-container"
            className="w-full max-w-[210mm] aspect-[210/297] bg-white shadow-xl rounded-sm overflow-hidden"
          >
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
