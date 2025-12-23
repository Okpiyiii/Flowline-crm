import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Task, TaskStatus, Lead, ViewState } from '../types';
import { Button } from './ui/GlassComponents';
import { TaskBoard } from './TaskBoard';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';

interface TasksProps {
    leads: Lead[];
}

export const Tasks: React.FC<TasksProps> = ({ leads }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [viewMode, setViewMode] = useState<'BOARD' | 'LIST'>('BOARD');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks:', error);
                // Fallback or empty state
            } else {
                setTasks(data as unknown as Task[] || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newTask = {
                ...taskData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            if (taskData.id) {
                // Update
                const { error } = await supabase
                    .from('tasks')
                    .update({
                        title: taskData.title,
                        description: taskData.description,
                        status: taskData.status,
                        priority: taskData.priority,
                        due_date: taskData.due_date,
                        related_lead_id: taskData.related_lead_id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', taskData.id);

                if (error) throw error;

                setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
            } else {
                // Insert
                const { data, error } = await supabase
                    .from('tasks')
                    .insert(newTask)
                    .select()
                    .single();

                if (error) throw error;
                if (data) setTasks(prev => [data as unknown as Task, ...prev]);
            }
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Failed to save task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!confirm("Delete this task?")) return;

        try {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) throw error;
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const handleUpdateStatus = async (id: string, status: TaskStatus) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));

        const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
        if (error) {
            console.error("Error updating status:", error);
            fetchTasks(); // Revert
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-100">
                <h1 className="text-xl font-medium text-zinc-900">Tasks</h1>
                <div className="flex space-x-2">
                    <div className="flex bg-zinc-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('BOARD')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'BOARD' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <Button size="sm" onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}>
                        <Plus size={16} className="mr-1" /> New Task
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {/* Filters could go here */}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-48 text-zinc-400">Loading tasks...</div>
                    ) : viewMode === 'BOARD' ? (
                        <TaskBoard
                            tasks={filteredTasks}
                            leads={leads}
                            onEditTask={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                            onDeleteTask={handleDeleteTask}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            leads={leads}
                            onEditTask={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                            onDeleteTask={handleDeleteTask}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    )}
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                initialData={editingTask}
                leads={leads}
            />
        </div>
    );
};
