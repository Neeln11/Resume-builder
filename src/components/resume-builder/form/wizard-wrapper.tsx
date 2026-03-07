"use client";

import { useState, useEffect } from "react";
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
    const { user } = useAuth();

    const methods = useForm<ResumeData>({
        resolver: zodResolver(resumeSchema) as any,
        defaultValues: initialData,
        mode: "onBlur",
    });

    const {
        watch,
        trigger,
        formState: { errors },
        reset,
    } = methods;

    // Watch for changes and notify parent for the live preview
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as ResumeData);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

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
                .catch((error: any) => console.error("Error saving resume to Firebase:", error));

            // Generate PDF directly without the print dialog
            setTimeout(async () => {
                const element = document.getElementById('resume-preview-container');

                if (!element) {
                    console.error("Could not find resume preview element");
                    window.print();
                    return;
                }

                const fullName = cleanData.personalDetails?.fullName || 'resume';

                try {
                    // Dynamically import to keep bundle size small & avoid SSR issues
                    const [html2canvasModule, jsPDFModule] = await Promise.all([
                        import('html2canvas'),
                        import('jspdf'),
                    ]);
                    const html2canvas = html2canvasModule.default;
                    const jsPDF = jsPDFModule.default;

                    // Take a screenshot of the resume element
                    const canvas = await html2canvas(element as HTMLElement, {
                        scale: 2,
                        useCORS: true,
                        onclone: (clonedDoc: Document) => {
                            // html2canvas cannot parse oklch() colors used by Tailwind v4.
                            // Override CSS variables with hex equivalents on the cloned doc.
                            const root = clonedDoc.documentElement;
                            root.style.setProperty('--background', '#ffffff');
                            root.style.setProperty('--foreground', '#1a1a1a');
                            root.style.setProperty('--card', '#ffffff');
                            root.style.setProperty('--card-foreground', '#1a1a1a');
                            root.style.setProperty('--popover', '#ffffff');
                            root.style.setProperty('--popover-foreground', '#1a1a1a');
                            root.style.setProperty('--primary', '#1a1a1a');
                            root.style.setProperty('--primary-foreground', '#fafafa');
                            root.style.setProperty('--secondary', '#f4f4f5');
                            root.style.setProperty('--secondary-foreground', '#1a1a1a');
                            root.style.setProperty('--muted', '#f4f4f5');
                            root.style.setProperty('--muted-foreground', '#71717a');
                            root.style.setProperty('--accent', '#f4f4f5');
                            root.style.setProperty('--accent-foreground', '#1a1a1a');
                            root.style.setProperty('--destructive', '#ef4444');
                            root.style.setProperty('--border', '#e4e4e7');
                            root.style.setProperty('--input', '#e4e4e7');
                            root.style.setProperty('--ring', '#a1a1aa');
                        }
                    });

                    // A4 dimensions in mm
                    const pdfWidth = 210;
                    const pdfHeight = 297;

                    const imgData = canvas.toDataURL('image/jpeg', 0.98);
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;

                    // Calculate height to maintain aspect ratio
                    const ratio = pdfWidth / imgWidth;
                    const scaledHeight = (imgHeight * ratio);

                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                    });

                    // Add image page by page if content is taller than one A4 page
                    let yPos = 0;
                    while (yPos < scaledHeight) {
                        if (yPos > 0) pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, -yPos, pdfWidth, scaledHeight);
                        yPos += pdfHeight;
                    }

                    pdf.save(`${fullName}.pdf`);

                    if (onReset) setTimeout(() => onReset(), 500);
                } catch (err) {
                    console.error("PDF generation failed, falling back to print:", err);
                    window.print();
                    if (onReset) setTimeout(() => onReset(), 500);
                }
            }, 500);
        } else {
            console.error("Validation failed. Errors:", methods.formState.errors);
            const errorKeys = Object.keys(methods.formState.errors);
            alert(`There are missing or invalid fields in: ${errorKeys.join(", ")}. Please click 'Previous' to go back and fix them.`);
        }
    };

    const handleLoginSuccess = () => {
        // Once logged in, attempt to finish again after a short delay
        // This ensures the login modal has time to animate out and disappear from the DOM
        setTimeout(() => {
            handleFinish();
        }, 500);
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

                    <div className="flex justify-between mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>
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
            </FormProvider>

            <LoginModal
                isOpen={isLoginModalOpen}
                onOpenChange={setIsLoginModalOpen}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}
