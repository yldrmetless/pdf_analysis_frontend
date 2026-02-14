import { Sparkles, X } from "lucide-react";

interface SuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: string[] | undefined;
}

export function SuggestionsModal({ isOpen, onClose, suggestions }: SuggestionsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">AI Suggestions</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {suggestions?.join(" ")}
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2.5 bg-[#1F2937] hover:bg-[#374151] border border-gray-700 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
