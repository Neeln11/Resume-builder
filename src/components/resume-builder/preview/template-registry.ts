import { ElementType } from "react";
import DefaultTemplate from "./templates/default-template";
import MinimalTemplate from "./templates/minimal-template";
import CreativeTemplate from "./templates/creative-template";
import { ResumeData } from "@/lib/schema";

export interface TemplateProps {
    data: ResumeData;
}

export type Template = {
    id: string;
    name: string;
    component: ElementType<TemplateProps>;
};

export const templates: Record<string, Template> = {
    "default": {
        id: "default",
        name: "Professional Standard",
        component: DefaultTemplate
    },
    "minimal": {
        id: "minimal",
        name: "Clean Minimalist",
        component: MinimalTemplate
    },
    "creative": {
        id: "creative",
        name: "Modern Creative",
        component: CreativeTemplate
    }
};

export const availableTemplates = Object.values(templates);
