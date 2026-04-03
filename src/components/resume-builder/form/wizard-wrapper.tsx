"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    resumeSchema,
    ResumeData,
    defaultResumeData,
} from "@/lib/schema";
import { Button } from "@/components/ui/button";

// Step Components
import PersonalDetailsForm from "./personal-details-form";
import SummaryForm from "./summary-form";
import EducationForm from "./education-form";
import ExperienceForm from "./experience-form";
import ProjectsForm from "./projects-form";
import SkillsForm from "./skills-form";
import LayoutForm from "./layout-form";
import { useAuth } from "@/components/auth/auth-context";
import { LoginModal } from "@/components/auth/login-modal";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { Sparkles } from "lucide-react";
import { ATSModal } from "../ats-modal";

const availableSections: Record<string, { title: string; component: React.ElementType }> = {
    summary: { title: "Professional Summary", component: SummaryForm },
    education: { title: "Education", component: EducationForm },
    experience: { title: "Experience", component: ExperienceForm },
    projects: { title: "Projects", component: ProjectsForm },
    skills: { title: "Skills", component: SkillsForm },
};

interface WizardWrapperProps {
    initialData?: ResumeData;
    resumeId?: string | null;
    onDataChange: (data: ResumeData) => void;
    onReset?: () => void;
}

export default function WizardWrapper({ initialData = defaultResumeData, resumeId = null, onDataChange, onReset }: WizardWrapperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isATSModalOpen, setIsATSModalOpen] = useState(false);
    const { user } = useAuth();

    const safeInitialData = { ...initialData };
    // Cleanup legacy skills if they are present
    if (safeInitialData.skills && safeInitialData.skills.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstSkill = safeInitialData.skills[0] as any;
        if (firstSkill.name !== undefined && firstSkill.title === undefined) {
            safeInitialData.skills = [];
        }
    }

    const methods = useForm<ResumeData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(resumeSchema) as any,
        defaultValues: safeInitialData,
        mode: "onBlur",
    });

    // Snapshot of form data captured just before login modal opens.
    // Used so login doesn't trigger a form reset before we run the PDF.
    const pendingFormDataRef = useRef<ResumeData | null>(null);

    const {
        watch,
        trigger,
    } = methods;

    // Watch for changes and notify parent for the live preview
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as ResumeData);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    // Sync external template changes (from the dropdown in page.tsx) into the form state so it saves correctly
    useEffect(() => {
        if (initialData.template && initialData.template !== methods.getValues("template")) {
            methods.setValue("template", initialData.template, { shouldDirty: true });
        }
    }, [initialData.template, methods]);

    // Derive active steps based on sectionOrder
    const sectionOrder = watch("sectionOrder") || [];

    // Always start with Personal Details, then the dynamic sections, then Layout
    const activeSteps = [
        { id: "personal", title: "Personal Details", component: PersonalDetailsForm },
        ...sectionOrder.map((sectionId) => ({
            id: sectionId,
            ...(availableSections[sectionId] || { title: "Unknown", component: () => null })
        })),
        { id: "layout", title: "Resume Layout", component: LayoutForm }
    ];

    const nextStep = async () => {
        // Validate current section before moving
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fieldsToValidate: any = [];
        const currentId = activeSteps[currentStep].id;
        switch (currentId) {
            case "personal":
                fieldsToValidate = ["personalDetails.fullName", "personalDetails.email", "personalDetails.phone", "personalDetails.github", "personalDetails.linkedin", "personalDetails.leetcode"];
                break;
            case "summary":
                fieldsToValidate = ["summary.summary", "summary.heading"];
                break;
            case "education":
                fieldsToValidate = ["education"];
                break;
            case "experience":
                fieldsToValidate = ["experience"];
                break;
            case "projects":
                fieldsToValidate = ["projects"];
                break;
            case "skills":
                fieldsToValidate = ["skills"];
                break;
            case "layout":
                fieldsToValidate = ["sectionOrder"];
                break;
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, activeSteps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleFinish = async () => {
        console.log("handleFinish triggered");
        const isAllValid = await trigger();
        console.log("Validation result:", isAllValid);

        if (isAllValid) {
            const currentUser = user || auth.currentUser;

            if (!currentUser) {
                // Snapshot the form data NOW before the login modal can cause any re-renders
                pendingFormDataRef.current = methods.getValues();
                console.log("No authenticated user found, opening login modal.");
                setIsLoginModalOpen(true);
                return;
            }

            console.log("Attempting to save to Firestore. User ID:", currentUser.uid);

            // Strip undefined values which Firebase rejects by serializing to JSON
            const cleanData = JSON.parse(JSON.stringify(methods.getValues()));

            const payload = {
                ...cleanData,
                updatedAt: new Date().toISOString(),
            };

            // Fire-and-forget save so it doesn't hang UI if Firestore is uninitialized or offline
            const savePromise = resumeId
                ? setDoc(doc(db, "users", currentUser.uid, "resumes", resumeId), payload)
                : addDoc(collection(db, "users", currentUser.uid, "resumes"), payload);

            savePromise
                .then(() => console.log("Successfully saved to Firestore."))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((error: any) => console.error("Error saving resume to Firebase:", error));

            // Generate PDF directly without the print dialog
            setTimeout(async () => {
                const element = document.getElementById('pdf-resume-capture');

                if (!element) {
                    console.error("Could not find resume preview element");
                    alert("System error: Could not find the PDF rendering layer. Please refresh and try again.");
                    return;
                }

                const name = cleanData.personalDetails?.fullName || 'John_Doe';
                const firstRole = cleanData.experience?.[0]?.role || '';
                const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
                const cleanRole = firstRole.replace(/[^a-zA-Z0-9]/g, '_');
                const fullName = [cleanName, cleanRole, 'Resume'].filter(Boolean).join('_');

                try {
                    // html-to-image uses the browser's native rendering pipeline so it
                    // correctly handles modern CSS color functions like lab() and oklch()
                    // used by Tailwind v4 — unlike html2canvas which crashes on them.
                    const [htmlToImageModule, jsPDFModule] = await Promise.all([
                        import('html-to-image'),
                        import('jspdf'),
                    ]);
                    const { toPng } = htmlToImageModule;
                    const jsPDF = jsPDFModule.default;

                    // Render the resume element to a high-res PNG data URL for lossless text
                    const imgData = await toPng(element as HTMLElement, {
                        pixelRatio: 4, // 4x scale for high DPI (fixes zoom blur)
                        backgroundColor: '#ffffff',
                        filter: (node: Node) => {
                            if (node instanceof HTMLElement && node.dataset.pdfIgnore === 'true') return false;
                            return true;
                        },
                    });

                    // Get element dimensions for correct PDF sizing
                    const rect = element.getBoundingClientRect();
                    const imgWidthPx = rect.width * 4;
                    const imgHeightPx = rect.height * 4;

                    // A4 dimensions in mm
                    const pdfWidth = 210;
                    const pdfHeight = 297;

                    const ratio = pdfWidth / imgWidthPx;
                    const scaledHeight = imgHeightPx * ratio;

                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                    });

                    // Add image page by page if content is taller than one A4 page
                    // We use an incredibly small epsilon (1mm) to prevent Javascript floating point
                    // inaccuracies (e.g. 297.015 > 297.0) from improperly adding a blank second page.
                    let yPos = 0;
                    while (yPos < scaledHeight - 1) {
                        if (yPos > 0) pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, -yPos, pdfWidth, scaledHeight, '', 'FAST');
                        yPos += pdfHeight;
                    }

                    pdf.save(`${fullName}.pdf`);

                    if (onReset) setTimeout(() => onReset(), 500);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    console.error("PDF generation failed:", err);
                    alert(`PDF generation failed: ${err?.message || String(err)}. Please check the browser console for details.`);
                }
            }, 500);
        } else {
            console.error("Validation failed. Errors:", methods.formState.errors);
            const errorKeys = Object.keys(methods.formState.errors);
            alert(`There are missing or invalid fields in: ${errorKeys.join(", ")}. Please click 'Previous' to go back and fix them.`);
        }
    };

    const handleLoginSuccess = () => {
        // Use the snapshot captured before the login modal opened.
        // We do NOT re-call handleFinish() because auth state change may have
        // triggered a form reset, giving us blank data.
        const snapshot = pendingFormDataRef.current;
        pendingFormDataRef.current = null;

        if (!snapshot) {
            // Fallback: no snapshot means we can just re-run handleFinish normally
            setTimeout(() => handleFinish(), 500);
            return;
        }

        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Save to Firestore using the snapshot
        const cleanData = JSON.parse(JSON.stringify(snapshot));
        const payload = { ...cleanData, updatedAt: new Date().toISOString() };
        const savePromise = resumeId
            ? setDoc(doc(db, "users", currentUser.uid, "resumes", resumeId), payload)
            : addDoc(collection(db, "users", currentUser.uid, "resumes"), payload);
        savePromise
            .then(() => console.log("Saved to Firestore after login."))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((err: any) => console.error("Firestore save failed:", err));

        // Generate the PDF from the snapshot — delay to let the modal close
        setTimeout(async () => {
            const element = document.getElementById('pdf-resume-capture');
            if (!element) { 
                console.error("System error: Could not find the PDF rendering layer");
                alert("Failed to render PDF. Please refresh."); 
                return; 
            }

            const name = cleanData.personalDetails?.fullName || 'John_Doe';
            const firstRole = cleanData.experience?.[0]?.role || '';
            const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
            const cleanRole = firstRole.replace(/[^a-zA-Z0-9]/g, '_');
            const fullName = [cleanName, cleanRole, 'Resume'].filter(Boolean).join('_');
            try {
                const [htmlToImageModule, jsPDFModule] = await Promise.all([
                    import('html-to-image'),
                    import('jspdf'),
                ]);
                const { toPng } = htmlToImageModule;
                const jsPDF = jsPDFModule.default;

                const imgData = await toPng(element as HTMLElement, {
                    pixelRatio: 4, backgroundColor: '#ffffff',
                    filter: (node: Node) => {
                        if (node instanceof HTMLElement && node.dataset.pdfIgnore === 'true') return false;
                        return true;
                    },
                });

                const rect = element.getBoundingClientRect();
                const pdfWidth = 210, pdfHeight = 297;
                const ratio = pdfWidth / (rect.width * 4);
                const scaledHeight = rect.height * 4 * ratio;

                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                let yPos = 0;
                while (yPos < scaledHeight - 1) {
                    if (yPos > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, -yPos, pdfWidth, scaledHeight, '', 'FAST');
                    yPos += pdfHeight;
                }
                pdf.save(`${fullName}.pdf`);
                if (onReset) setTimeout(() => onReset(), 500);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('PDF generation failed after login:', err);
                alert(`PDF generation failed: ${err?.message || String(err)}`);
            }
        }, 700);
    };

    const CurrentStepComponent = activeSteps[currentStep]?.component;

    if (!CurrentStepComponent) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Step {currentStep + 1} of {activeSteps.length}
                </h2>
                <h1 className="text-2xl font-bold">{activeSteps[currentStep].title}</h1>
            </div>

            <FormProvider {...methods}>
                <form className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-4 pb-4">
                        <CurrentStepComponent />
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>

                        <div className="flex-1 flex justify-center px-4">
                            {currentStep === activeSteps.length - 1 && (
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={() => setIsATSModalOpen(true)}
                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-sm transition-all"
                                >
                                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> ATS Score Check
                                </Button>
                            )}
                        </div>

                        {currentStep < activeSteps.length - 1 ? (
                            <Button type="button" onClick={nextStep}>
                                Next Step
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleFinish}>
                                Download
                            </Button>
                        )}
                    </div>
                </form>

                <ATSModal isOpen={isATSModalOpen} onOpenChange={setIsATSModalOpen} />
            </FormProvider>

            <LoginModal
                isOpen={isLoginModalOpen}
                onOpenChange={setIsLoginModalOpen}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}
