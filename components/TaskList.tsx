import React from 'react';
import { Task, TaskStatus, TaskPriority, Lead } from '../types';
import { Badge } from './ui/GlassComponents';

interface TaskListProps {
    tasks: Task[];
    leads: Lead[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, leads, onEditTask, onDeleteTask }) => {
    return (
        <div className="w-full bg-white border border-zinc-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                    <tr>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider w-10">
                            <input type="checkbox" className="rounded border-zinc-300" />
                        </th>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Related Lead</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {tasks.map(task => {
                        const lead = leads.find(l => l.id === task.related_lead_id);
                        return (
                            <tr
                                key={task.id}
                                className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                                onClick={() => onEditTask(task)}
                            >
                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-zinc-300" />
                                </td>
                                <td className="px-4 py-3 font-medium text-zinc-900">{task.title}</td>
                                <td className="px-4 py-3">
                                    <Badge color={task.status === TaskStatus.DONE ? 'green' : task.status === TaskStatus.IN_PROGRESS ? 'blue' : 'gray'}>
                                        {task.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] uppercase font-bold ${task.priority === TaskPriority.HIGH ? 'text-red-600' :
                                            task.priority === TaskPriority.MEDIUM ? 'text-amber-600' : 'text-zinc-500'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-500">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-3 text-zinc-500">
                                    {lead ? lead.name : '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {tasks.length === 0 && (
                <div className="p-8 text-center text-zinc-400 text-sm">No tasks found</div>
            )}
        </div>
    );
};
