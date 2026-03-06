import { ResumeData } from "@/lib/schema";
import { Mail, Phone, Github, Linkedin, Globe } from "lucide-react";

interface DefaultTemplateProps {
    data: ResumeData;
}

export default function DefaultTemplate({ data }: DefaultTemplateProps) {
    const { personalDetails, summary, experience, education, projects, skills, sectionOrder, themeConfig } = data;

    const hasPersonalDetails =
        personalDetails.fullName ||
        personalDetails.email ||
        personalDetails.phone ||
        personalDetails.github ||
        personalDetails.linkedin ||
        personalDetails.leetcode;

    return (
        <div className="p-8 max-w-[21cm] mx-auto bg-white text-slate-900 font-sans min-h-[29.7cm] break-words">
            {/* Header section */}
            {hasPersonalDetails && (
                <header className="mb-6 border-b border-slate-300 pb-4 text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ color: themeConfig?.personalDetails || "#1e293b" }}>
                        {personalDetails.fullName || "Your Name"}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
                        {personalDetails.email && (
                            <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{personalDetails.email}</span>
                            </div>
                        )}
                        {personalDetails.phone && (
                            <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{personalDetails.phone}</span>
                            </div>
                        )}
                        {personalDetails.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin className="h-3 w-3" />
                                <a href={personalDetails.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">LinkedIn</a>
                            </div>
                        )}
                        {personalDetails.github && (
                            <div className="flex items-center gap-1">
                                <Github className="h-3 w-3" />
                                <a href={personalDetails.github} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">GitHub</a>
                            </div>
                        )}
                        {personalDetails.leetcode && (
                            <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <a href={personalDetails.leetcode} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">Portfolio/LeetCode</a>
                            </div>
                        )}
                    </div>
                </header>
            )}

            {/* Body sections sorted dynamically */}
            <div className="flex flex-col w-full min-w-0">
                {sectionOrder && sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case "summary":
                            return summary?.summary && (
                                <section key="summary" className="mb-6 order-none w-full min-w-0">
                                    <h2 className="text-lg font-semibold tracking-wide uppercase mb-2" style={{ color: themeConfig?.summary || "#1e293b" }}>
                                        {summary.heading || "Professional Summary"}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                                        {summary.summary}
                                    </p>
                                </section>
                            );
                        case "experience":
                            return experience && experience.length > 0 && (
                                <section key="experience" className="mb-6 order-none w-full min-w-0">
                                    <h2 className="text-lg font-semibold tracking-wide uppercase mb-3 border-b pb-1" style={{ color: themeConfig?.experience || "#1e293b", borderColor: themeConfig?.experience || "#e2e8f0" }}>Experience</h2>
                                    <div className="space-y-4">
                                        {experience.map((exp, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800">{exp.role}</h3>
                                                        <p className="text-sm text-slate-600 font-medium">{exp.company}</p>
                                                    </div>
                                                    <div className="text-sm text-slate-500 whitespace-nowrap">
                                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : "- Present"}
                                                    </div>
                                                </div>
                                                {exp.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "projects":
                            return projects && projects.length > 0 && (
                                <section key="projects" className="mb-6 order-none w-full min-w-0">
                                    <h2 className="text-lg font-semibold tracking-wide uppercase mb-3 border-b pb-1" style={{ color: themeConfig?.projects || "#1e293b", borderColor: themeConfig?.projects || "#e2e8f0" }}>Projects</h2>
                                    <div className="space-y-4">
                                        {projects.map((project, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-slate-800">
                                                        {project.name}
                                                        {project.link && (
                                                            <a href={project.link} target="_blank" rel="noreferrer" className="text-blue-600 text-xs ml-2 hover:underline font-normal">
                                                                [Link]
                                                            </a>
                                                        )}
                                                    </h3>
                                                </div>
                                                {project.technologies && (
                                                    <p className="text-xs font-medium text-slate-500 mb-1">Technologies: {project.technologies}</p>
                                                )}
                                                {project.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{project.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "education":
                            return education && education.length > 0 && (
                                <section key="education" className="mb-6 order-none w-full min-w-0">
                                    <h2 className="text-lg font-semibold tracking-wide uppercase mb-3 border-b pb-1" style={{ color: themeConfig?.education || "#1e293b", borderColor: themeConfig?.education || "#e2e8f0" }}>Education</h2>
                                    <div className="space-y-4">
                                        {education.map((edu, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                                                        <p className="text-sm text-slate-600 font-medium">{edu.institution}</p>
                                                    </div>
                                                    <div className="text-sm text-slate-500 whitespace-nowrap">
                                                        {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : "- Present"}
                                                    </div>
                                                </div>
                                                {edu.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{edu.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "skills":
                            return skills && skills.length > 0 && (
                                <section key="skills" className="mb-6 order-none w-full min-w-0">
                                    <h2 className="text-lg font-semibold tracking-wide uppercase mb-3 border-b pb-1" style={{ color: themeConfig?.skills || "#1e293b", borderColor: themeConfig?.skills || "#e2e8f0" }}>Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            skill.name && (
                                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium border border-slate-200">
                                                    {skill.name}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </section>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}
