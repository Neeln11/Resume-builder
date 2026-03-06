import { z } from "zod";

export const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  leetcode: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const professionalSummarySchema = z.object({
  heading: z.string().optional(),
  summary: z.string().min(10, "Summary should be at least 10 characters").max(2000, "Summary is too long"),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(2, "Degree/Course is required"),
  institution: z.string().min(2, "Institution is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill is required"),
});

export const themeConfigSchema = z.object({
  personalDetails: z.string().optional(),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  projects: z.string().optional(),
  skills: z.string().optional(),
});

export const resumeSchema = z.object({
  personalDetails: personalDetailsSchema,
  summary: professionalSummarySchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  sectionOrder: z.array(z.string()).default(["summary", "experience", "education", "projects", "skills"]),
  themeConfig: themeConfigSchema.default({}),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type ProfessionalSummary = z.infer<typeof professionalSummarySchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;

export const defaultResumeData: ResumeData = {
  personalDetails: {
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    leetcode: "",
  },
  summary: {
    heading: "",
    summary: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  sectionOrder: ["summary", "experience", "education", "projects", "skills"],
  themeConfig: {
    personalDetails: "#1e293b", // slate-800
    summary: "#1e293b",
    education: "#1e293b",
    experience: "#1e293b",
    projects: "#1e293b",
    skills: "#1e293b",
  },
};
