import { ResumeData } from "@/lib/schema";
import DefaultTemplate from "./templates/default-template";

interface ResumePreviewProps {
    data: ResumeData;
    templateConfig?: {
        theme?: string;
        layout?: string;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ResumePreview({ data, templateConfig }: ResumePreviewProps) {
    // In the future, templateConfig could determine which template component to render.
    // For now, we use the DefaultTemplate.

    return (
        <div className="w-full h-full bg-white overflow-y-auto print:overflow-visible">
            <div id="resume-preview-container" className="w-full min-h-full bg-white print:w-[210mm] print:min-h-[297mm]">
                {/* Render the selected template */}
                <DefaultTemplate data={data} />
            </div>
        </div>
    );
}
