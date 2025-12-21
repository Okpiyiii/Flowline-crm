import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { PipelineStage } from '../types';

interface CreateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (lead: any) => Promise<void>;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        value: '',
        status: PipelineStage.NEW,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                value: Number(formData.value) || 0,
            });
            // Reset form
            setFormData({
                name: '',
                company: '',
                email: '',
                value: '',
                status: PipelineStage.NEW,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-zinc-100 p-6 pointer-events-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-zinc-900">New Lead</h2>
                                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Lead Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Value ($)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Initial Stage</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as PipelineStage })}
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm appearance-none"
                                    >
                                        {Object.values(PipelineStage).map(stage => (
                                            <option key={stage} value={stage}>{stage}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70 flex items-center"
                                    >
                                        {loading && <Loader2 size={14} className="animate-spin mr-2" />}
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
