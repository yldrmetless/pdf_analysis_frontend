import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting = false }: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-2">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>

                    <h2 className="text-xl font-semibold text-white">Delete Document</h2>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Are you sure you want to delete this document? This action cannot be undone and all associated analysis data will be permanently removed from our servers.
                    </p>

                    <div className="flex items-center gap-3 w-full mt-6">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-[#1F2937] hover:bg-[#374151] border border-gray-700 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 border border-rose-500 rounded-lg text-sm font-medium text-white transition-colors shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
