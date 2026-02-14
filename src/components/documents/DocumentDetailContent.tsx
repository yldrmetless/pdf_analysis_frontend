import { DocumentAnalysisStatus } from "@/features/analysis/analysisApi";
import { Briefcase, GraduationCap, User, Code2, Phone } from "lucide-react";

interface DocumentDetailContentProps {
    documentData: DocumentAnalysisStatus;
    analysisJson: any | null;
}

export function DocumentDetailContent({ documentData, analysisJson }: DocumentDetailContentProps) {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl -z-10 blur-xl opacity-50" />

            <div className="bg-[#0B0E14] border border-[#1F2937] rounded-2xl p-6 md:p-10 shadow-2xl">
                {/* Big Title */}
                {documentData.title && (
                    <div className="mb-10 text-center border-b border-gray-800 pb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                            {documentData.title}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Analysis Report</p>
                    </div>
                )}

                {!analysisJson ? (
                    <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
                        <Briefcase className="w-10 h-10 opacity-20" />
                        <p>No analysis content available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-12 max-w-4xl mx-auto">

                        {/* Personal Profile */}
                        {analysisJson.personal_profile?.description && (
                            <section className="space-y-3">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-indigo-400" />
                                    Personal Profile
                                </h2>
                                <div className="bg-[#111827]/50 rounded-xl p-6 border border-gray-800/50">
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                        {analysisJson.personal_profile.description}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Work Experience */}
                        {Array.isArray(analysisJson.work_experience) && analysisJson.work_experience.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                                    <Briefcase className="w-5 h-5 text-indigo-400" />
                                    Work Experience
                                </h2>
                                <div className="space-y-4">
                                    {analysisJson.work_experience.map((job: any, idx: number) => (
                                        <div key={idx} className="group hover:bg-[#111827] p-5 rounded-xl border border-transparent hover:border-gray-800 transition-all">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-1 mb-2">
                                                <h3 className="text-lg font-medium text-white group-hover:text-indigo-300 transition-colors">
                                                    {job.position || job.role || "Experience"}
                                                </h3>
                                                {job.duration && (
                                                    <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded shrink-0">
                                                        {job.duration}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-400 font-medium mb-3">
                                                {job.company && <span>{job.company}</span>}
                                                {job.project && <span className="block text-indigo-400/80 text-xs mt-1">Project: {job.project}</span>}
                                            </div>

                                            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                                                <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-400/90 leading-relaxed marker:text-indigo-500/50">
                                                    {job.responsibilities.map((res: string, rIdx: number) => (
                                                        <li key={rIdx}>{res}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {Array.isArray(analysisJson.education) && analysisJson.education.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                                    Education
                                </h2>
                                <div className="grid grid-cols-1 gap-3">
                                    {analysisJson.education.map((edu: any, idx: number) => (
                                        <div key={idx} className="bg-[#111827]/30 p-4 rounded-lg border border-gray-800/50 flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <h3 className="text-white font-medium">{edu.institution}</h3>
                                                <p className="text-sm text-indigo-300">{edu.field_of_study}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                {edu.duration && <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{edu.duration}</span>}
                                                {edu.status && <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">{edu.status}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {Array.isArray(analysisJson.skills) && analysisJson.skills.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                                    <Code2 className="w-5 h-5 text-indigo-400" />
                                    Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {analysisJson.skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-full bg-[#1F2937]/50 border border-[#374151] text-sm text-gray-300 shadow-sm hover:border-indigo-500/30 hover:bg-[#1F2937] transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {Array.isArray(analysisJson.references) && analysisJson.references.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                                    <Phone className="w-5 h-5 text-indigo-400" />
                                    References
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysisJson.references.map((ref: any, idx: number) => (
                                        <div key={idx} className="bg-[#111827] p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{ref.name}</p>
                                                {ref.phone && <p className="text-xs text-gray-500">{ref.phone}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
