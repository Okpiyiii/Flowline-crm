import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Flag, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from './ui/GlassComponents';
import { Lead, Task, TaskStatus, TaskPriority } from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    initialData?: Task;
    leads: Lead[];
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, leads }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [relatedLeadId, setRelatedLeadId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setStatus(initialData.status);
            setPriority(initialData.priority);
            if (initialData.due_date) {
                const dateObj = new Date(initialData.due_date);
                setDueDate(dateObj.toISOString().split('T')[0]);
                setDueTime(dateObj.toTimeString().slice(0, 5));
            }
            setRelatedLeadId(initialData.related_lead_id || '');
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.TODO);
        setPriority(TaskPriority.MEDIUM);
        setDueDate('');
        setDueTime('');
        setRelatedLeadId('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        let combinedDate = undefined;
        if (dueDate) {
            // Create date in UTC or local? Let's stick to simple ISO string for now.
            // Combining date and time strings simply for storage
            const dateStr = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T12:00:00`;
            combinedDate = new Date(dateStr).toISOString();
        }

        const taskData: Partial<Task> = {
            title,
            description,
            status,
            priority,
            due_date: combinedDate,
            related_lead_id: relatedLeadId || undefined,
        };

        if (initialData) {
            taskData.id = initialData.id;
        }

        await onSubmit(taskData);
        setIsSubmitting(false);
        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
                    <h2 className="text-sm font-medium text-zinc-900">{initialData ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
                    <div>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-lg font-medium placeholder:text-zinc-300 border-none focus:ring-0 p-0 text-zinc-900 bg-transparent"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Description / notes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full text-sm text-zinc-600 placeholder:text-zinc-300 border-none focus:ring-0 p-0 bg-transparent resize-none min-h-[60px]"
                        />
                    </div>

                    <div className="space-y-3 pt-2">

                        <div className="flex items-center space-x-2">
                            <div className="w-8 flex justify-center text-zinc-400"><Calendar size={16} /></div>
                            <div className="flex-1 flex space-x-2">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-700"
                                />
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className="w-32 text-sm border border-zinc-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 flex justify-center text-zinc-400"><Flag size={16} /></div>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-700 bg-white"
                            >
                                <option value={TaskPriority.LOW}>Low Priority</option>
                                <option value={TaskPriority.MEDIUM}>Medium Priority</option>
                                <option value={TaskPriority.HIGH}>High Priority</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 flex justify-center text-zinc-400"><AlertCircle size={16} /></div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-700 bg-white"
                            >
                                <option value={TaskStatus.TODO}>To Do</option>
                                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                <option value={TaskStatus.WAITING}>Waiting</option>
                                <option value={TaskStatus.DONE}>Done</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 flex justify-center text-zinc-400"><LinkIcon size={16} /></div>
                            <select
                                value={relatedLeadId}
                                onChange={(e) => setRelatedLeadId(e.target.value)}
                                className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-700 bg-white"
                            >
                                <option value="">No related lead</option>
                                {leads.map(lead => (
                                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </form>

                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
