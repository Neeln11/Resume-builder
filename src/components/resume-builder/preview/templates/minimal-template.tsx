import { ResumeData } from "@/lib/schema";

interface MinimalTemplateProps {
    data: ResumeData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
    const { personalDetails, summary, experience, education, projects, skills, sectionOrder, themeConfig } = data;

    const hasPersonalDetails =
        personalDetails.fullName ||
        personalDetails.email ||
        personalDetails.phone ||
        personalDetails.github ||
        personalDetails.linkedin ||
        personalDetails.leetcode;

    const accentColor = themeConfig?.personalDetails || "#0f172a"; // Very dark slate by default

    // Helper for formatting URLs cleanly
    const formatUrl = (url?: string) => {
        if (!url) return "";
        return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    };

    return (
        <div className="p-12 w-full mx-auto bg-white text-slate-800 font-sans min-h-full break-words selection:bg-slate-200">
            {/* Header section */}
            {hasPersonalDetails && (
                <header className="mb-12">
                    <h1 
                        className="text-[2.75rem] font-light tracking-tight leading-none mb-4" 
                        style={{ color: accentColor }}
                    >
                        {personalDetails.fullName || "Your Name"}
                    </h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-light tracking-wide">
                        {personalDetails.email && <span>{personalDetails.email}</span>}
                        {personalDetails.phone && <span>{personalDetails.phone}</span>}
                        {personalDetails.linkedin && <a href={personalDetails.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">{formatUrl(personalDetails.linkedin)}</a>}
                        {personalDetails.github && <a href={personalDetails.github} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">{formatUrl(personalDetails.github)}</a>}
                        {personalDetails.leetcode && <a href={personalDetails.leetcode} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">{formatUrl(personalDetails.leetcode)}</a>}
                    </div>
                </header>
            )}

            {/* Body sections sorted dynamically */}
            <div className="flex flex-col gap-10 w-full min-w-0">
                {sectionOrder && sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case "summary":
                            return summary?.summary && (
                                <section key="summary" className="w-full min-w-0 flex flex-col md:flex-row gap-6 md:gap-12">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 w-40 shrink-0 pt-1">
                                        {summary.heading || "Profile"}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words flex-1 max-w-3xl min-w-0">
                                        {summary.summary}
                                    </p>
                                </section>
                            );
                        case "experience":
                            return experience && experience.length > 0 && (
                                <section key="experience" className="w-full min-w-0 flex flex-col md:flex-row gap-6 md:gap-12">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 w-40 shrink-0 pt-1">Experience</h2>
                                    <div className="flex-1 space-y-8 max-w-3xl min-w-0">
                                        {experience.map((exp, index) => (
                                            <div key={index} className="min-w-0 relative group">
                                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-baseline mb-2">
                                                    <div>
                                                        <h3 className="text-base font-semibold text-slate-900">{exp.role}</h3>
                                                        <span className="text-sm text-slate-600 font-medium">{exp.company}</span>
                                                    </div>
                                                    <span className="text-[13px] tracking-wider text-slate-500 uppercase whitespace-nowrap mt-1 sm:mt-0">
                                                        {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : "— Present"}
                                                    </span>
                                                </div>
                                                {exp.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed mt-3">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "projects":
                            return projects && projects.length > 0 && (
                                <section key="projects" className="w-full min-w-0 flex flex-col md:flex-row gap-6 md:gap-12">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 w-40 shrink-0 pt-1">Projects</h2>
                                    <div className="flex-1 space-y-8 max-w-3xl min-w-0">
                                        {projects.map((project, index) => (
                                            <div key={index} className="min-w-0">
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
                                                    {project.link && (
                                                        <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 transition-colors">
                                                            View Code / Demo &rarr;
                                                        </a>
                                                    )}
                                                </div>
                                                {project.technologies && (
                                                    <p className="text-xs text-slate-500 mb-3 tracking-wide">{project.technologies}</p>
                                                )}
                                                {project.description && (
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">{project.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case "education":
                            return education && education.length > 0 && (
                                <section key="education" className="w-full min-w-0 flex flex-col md:flex-row gap-6 md:gap-12">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 w-40 shrink-0 pt-1">Education</h2>
                                    <div className="flex-1 space-y-6 max-w-3xl min-w-0">
                                        {education.map((edu, index) => (
                                            <div key={index} className="min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-baseline mb-1">
                                                    <h3 className="text-base font-semibold text-slate-900">{edu.degree}</h3>
                                                    <span className="text-[13px] tracking-wider text-slate-500 uppercase whitespace-nowrap mt-1 sm:mt-0">
                                                        {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : "— Present"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium">{edu.institution}</p>
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
                                <section key="skills" className="w-full min-w-0 flex flex-col md:flex-row gap-6 md:gap-12">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 w-40 shrink-0 pt-1">Skills</h2>
                                    <div className="flex-1 max-w-3xl min-w-0 space-y-5">
                                        {skills.map((category, index) => (
                                            category.title && category.skills && category.skills.length > 0 && (
                                                <div key={index} className="min-w-0">
                                                    <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{category.title}</h3>
                                                    <p className="text-[13px] tracking-wide text-slate-800 leading-relaxed font-mono">
                                                        {category.skills.filter(s => s.name).map(s => s.name).join("  //  ")}
                                                    </p>
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
