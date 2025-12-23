import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Lead } from '../types';
import { Badge } from './ui/GlassComponents';

interface TaskBoardProps {
    tasks: Task[];
    leads: Lead[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, leads, onEditTask, onDeleteTask, onUpdateStatus }) => {
    const columns = [
        { id: TaskStatus.TODO, label: 'To Do', color: 'bg-zinc-100' },
        { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
        { id: TaskStatus.WAITING, label: 'Waiting', color: 'bg-amber-50 text-amber-700' },
        { id: TaskStatus.DONE, label: 'Done', color: 'bg-emerald-50 text-emerald-700' },
    ];

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case TaskPriority.HIGH: return 'text-red-600 bg-red-50 ring-red-500/20';
            case TaskPriority.MEDIUM: return 'text-amber-600 bg-amber-50 ring-amber-500/20';
            case TaskPriority.LOW: return 'text-zinc-500 bg-zinc-100 ring-zinc-500/10';
            default: return 'text-zinc-500 bg-zinc-100 ring-zinc-500/10';
        }
    };

    return (
        <div className="flex h-full overflow-x-auto gap-4 pb-4">
            {columns.map(column => {
                const columnTasks = tasks.filter(t => t.status === column.id);
                return (
                    <div key={column.id} className="min-w-[300px] w-80 flex flex-col h-full rounded-lg bg-zinc-50/50 border border-zinc-200/50">
                        <div className={`p-3 border-b border-zinc-200/50 flex items-center justify-between ${column.color} rounded-t-lg bg-opacity-40`}>
                            <span className="font-medium text-sm text-zinc-900">{column.label}</span>
                            <span className="text-xs text-zinc-500 bg-white/50 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {columnTasks.map(task => {
                                const lead = leads.find(l => l.id === task.related_lead_id);
                                return (
                                    <div
                                        key={task.id}
                                        className="bg-white p-3 rounded-md shadow-sm border border-zinc-100 hover:shadow-md transition-shadow cursor-pointer group relative"
                                        onClick={() => onEditTask(task)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ring-1 ring-inset ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                                className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>

                                        <h3 className="text-sm font-medium text-zinc-900 mb-1 line-clamp-2">{task.title}</h3>

                                        {(task.description) && (
                                            <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{task.description}</p>
                                        )}

                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-50">
                                            <div className="text-xs text-zinc-400">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                            </div>
                                            {lead && (
                                                <div className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                                    {lead.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Simple drag/move simulation buttons for v1 if drag-n-drop is complex */}
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                            {/* Status change actions could go here or in a context menu */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
