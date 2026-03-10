"use client";

import { useState } from "react";
import WizardWrapper from "@/components/resume-builder/form/wizard-wrapper";
import ResumePreview from "@/components/resume-builder/preview/resume-preview";
import { ResumeData, defaultResumeData } from "@/lib/schema";
import { ProfileHeader } from "@/components/auth/profile-header";
import { HistoryModal } from "@/components/resume-builder/history-modal";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleReset = () => {
    setResumeData(defaultResumeData);
    setActiveResumeId(null);
  };

  const handleLoadResume = (id: string, data: ResumeData) => {
    setActiveResumeId(id);
    setResumeData(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left side: Form Wizard (Left side gets roughly 40-45% width on desktop) */}
      <section className="w-full md:w-[45%] lg:w-[40%] bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 print:hidden">
        <header className="px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              RB
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Resume<span className="text-slate-500 font-medium">Builder</span></h1>
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
      <section className="flex-1 bg-slate-100 h-screen overflow-y-auto p-4 md:p-8 lg:p-12 print:p-0 print:h-auto print:bg-white print:overflow-visible flex justify-center items-start">
        <div className="sticky top-8 w-full flex justify-center print:static">
          <div className="w-full max-w-[210mm] aspect-[210/297] bg-white transition-all duration-300 ease-in-out shadow-2xl rounded-sm overflow-hidden print:shadow-none print:rounded-none">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </section>

      <HistoryModal
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        onSelect={handleLoadResume}
      />
    </main>
  );
}
