import { ResumeData } from "@/lib/schema";
import { Mail, Phone, Github, Linkedin, Globe } from "lucide-react";

interface CreativeTemplateProps {
    data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
    const { personalDetails, summary, experience, education, projects, skills, sectionOrder, themeConfig } = data;

    const hasPersonalDetails =
        personalDetails.fullName ||
        personalDetails.email ||
        personalDetails.phone ||
        personalDetails.github ||
        personalDetails.linkedin ||
        personalDetails.leetcode;

    const primaryColor = themeConfig?.personalDetails || "#3b82f6"; // default blue

    return (
        <div className="w-full mx-auto bg-white text-slate-800 font-sans min-h-full break-words flex flex-col">
            {/* Header section with solid background */}
            {hasPersonalDetails && (
                <header className="px-10 py-12 text-white" style={{ backgroundColor: primaryColor }}>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                        {personalDetails.fullName || "Your Name"}
                    </h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90 font-medium">
                        {personalDetails.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 opacity-75" />
                                <span>{personalDetails.email}</span>
                            </div>
                        )}
                        {personalDetails.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 opacity-75" />
                                <span>{personalDetails.phone}</span>
                            </div>
                        )}
                        {personalDetails.linkedin && (
                            <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 opacity-75" />
                                <span>{personalDetails.linkedin.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "")}</span>
                            </div>
                        )}
                        {personalDetails.github && (
                            <div className="flex items-center gap-2">
                                <Github className="h-4 w-4 opacity-75" />
                                <span>{personalDetails.github.replace("https://github.com/", "")}</span>
                            </div>
                        )}
                        {personalDetails.leetcode && (
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 opacity-75" />
                                <span className="break-all">{personalDetails.leetcode.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            </div>
                        )}
                    </div>
                </header>
            )}

            {/* Body padding */}
            <div className="flex-1 p-10 flex flex-col gap-8 w-full min-w-0">
                {sectionOrder && sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case "summary":
                            return summary?.summary && (
                                <section key="summary" className="w-full min-w-0">
                                    <h2 className="text-xl font-bold mb-3 border-l-4 pl-3" style={{ borderColor: primaryColor, color: primaryColor }}>
                                        {summary.heading || "About"}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
                                        {summary.summary}
                                    </p>
                                </section>
                            );
                        case "experience":
                            return experience && experience.length > 0 && (
                                <section key="experience" className="w-full min-w-0 flex flex-col">
                                    <h2 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ borderColor: primaryColor, color: primaryColor }}>Experience</h2>
                                    <div className="space-y-6">
                                        {experience.map((exp, index) => (
                                            <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                                                <div className="absolute w-2.5 h-2.5 rounded-full -left-[6px] top-1.5" style={{ backgroundColor: primaryColor }}></div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-slate-800 text-lg">{exp.role}</h3>
                                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-100 px-2 py-1 rounded">
                                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : "- Present"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium mb-2">{exp.company}</p>
                                                {exp.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "projects":
                            return projects && projects.length > 0 && (
                                <section key="projects" className="w-full min-w-0 flex flex-col">
                                    <h2 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ borderColor: primaryColor, color: primaryColor }}>Projects</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.map((project, index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-0">
                                                <h3 className="font-bold text-slate-800">{project.name}</h3>
                                                {project.technologies && (
                                                    <p className="text-xs text-slate-500 my-1 font-mono bg-white inline-block px-1.5 py-0.5 rounded border border-slate-200">{project.technologies}</p>
                                                )}
                                                {project.description && (
                                                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-words leading-relaxed mt-2">{project.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "education":
                            return education && education.length > 0 && (
                                <section key="education" className="w-full min-w-0 flex flex-col">
                                    <h2 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ borderColor: primaryColor, color: primaryColor }}>Education</h2>
                                    <div className="space-y-4">
                                        {education.map((edu, index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-lg min-w-0">
                                                <div className="flex justify-between items-start gap-4 min-w-0">
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-slate-800 break-words">{edu.degree}</h3>
                                                        <p className="text-sm text-slate-600 font-medium break-words">{edu.institution}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                                            {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : "- Present"}
                                                        </span>
                                                    </div>
                                                </div>
                                                {edu.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed mt-2">{edu.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "skills":
                            return skills && skills.length > 0 && (
                                <section key="skills" className="w-full min-w-0">
                                    <h2 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ borderColor: primaryColor, color: primaryColor }}>Skills</h2>
                                    <div className="space-y-5">
                                        {skills.map((category, index) => (
                                            category.title && (
                                                <div key={index} className="min-w-0">
                                                    <h3 className="font-bold text-sm text-slate-700 uppercase tracking-widest mb-3 opacity-80">{category.title}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {category.skills && category.skills.filter(s => s.name).map((skill, sIdx) => (
                                                            <span key={sIdx} className="px-3 py-1 bg-slate-800 text-white text-sm rounded-full font-medium shadow-sm transition-transform hover:scale-105 cursor-default">
                                                                {skill.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
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
