import { ResumeData } from "@/lib/schema";
import DefaultTemplate from "./templates/default-template";

interface ResumePreviewProps {
    data: ResumeData;
    templateConfig?: {
        theme?: string;
        layout?: string;
    };
}

export default function ResumePreview({ data, templateConfig }: ResumePreviewProps) {
    // In the future, templateConfig could determine which template component to render.
    // For now, we use the DefaultTemplate.

    return (
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto print:shadow-none">
            <div className="origin-top bg-white print:w-[210mm] print:min-h-[297mm]">
                {/* Render the selected template */}
                <DefaultTemplate data={data} />
            </div>
        </div>
    );
}
