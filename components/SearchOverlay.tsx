import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Lead, Task, ViewState } from '../types';
import { Badge } from './ui/GlassComponents';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewState, id?: string) => void;
}

type SearchResult =
    | { type: 'LEAD', data: Lead }
    | { type: 'TASK', data: Task };

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'LEADS' | 'TASKS'>('ALL');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                let newResults: SearchResult[] = [];

                // Parallel fetch
                const fetchLeads = (filter === 'ALL' || filter === 'LEADS')
                    ? supabase
                        .from('leads')
                        .select('*')
                        .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
                        .limit(5)
                    : Promise.resolve({ data: [] });

                const fetchTasks = (filter === 'ALL' || filter === 'TASKS')
                    ? supabase
                        .from('tasks')
                        .select('*')
                        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                        .limit(5)
                    : Promise.resolve({ data: [] });

                const [leadsRes, tasksRes] = await Promise.all([fetchLeads, fetchTasks]);

                if (leadsRes.data) {
                    newResults = [...newResults, ...leadsRes.data.map((l: any) => ({ type: 'LEAD', data: l } as SearchResult))];
                }
                if (tasksRes.data) {
                    newResults = [...newResults, ...tasksRes.data.map((t: any) => ({ type: 'TASK', data: t } as SearchResult))];
                }

                setResults(newResults);

            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounce);
    }, [query, filter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-4 duration-200">

                {/* Header */}
                <div className="flex items-center p-4 border-b border-zinc-200/50 space-x-3">
                    <Search className="text-zinc-400" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search leads and tasks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-lg text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
                    />
                    {loading && <Loader2 className="animate-spin text-zinc-400" size={16} />}
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100">
                        <span className="sr-only">Close</span>
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-zinc-400 border border-zinc-200 rounded-md shadow-[0px_1px_0px_0px_rgba(0,0,0,0.08)] bg-zinc-50 tracking-tighter">ESC</kbd>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex px-4 py-2 space-x-2 bg-zinc-50/50 border-b border-zinc-100/50 text-sm">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1 rounded-full transition-colors ${filter === 'ALL' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('LEADS')}
                        className={`px-3 py-1 rounded-full transition-colors ${filter === 'LEADS' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                    >
                        Leads
                    </button>
                    <button
                        onClick={() => setFilter('TASKS')}
                        className={`px-3 py-1 rounded-full transition-colors ${filter === 'TASKS' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                    >
                        Tasks
                    </button>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-2">
                    {results.length === 0 && query.trim() !== '' && !loading ? (
                        <div className="p-8 text-center text-zinc-400 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {results.map((result, idx) => (
                                <div
                                    key={`${result.type}-${result.data.id}`}
                                    onClick={() => {
                                        if (result.type === 'LEAD') onNavigate('LEADS', result.data.id);
                                        if (result.type === 'TASK') onNavigate('TASKS', result.data.id);
                                        onClose();
                                    }}
                                    className="group flex items-center p-3 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${result.type === 'LEAD' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {result.type === 'LEAD' ? <User size={14} /> : <CheckSquare size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-zinc-900 truncate">
                                                {result.type === 'LEAD' ? result.data.name : result.data.title}
                                            </h3>
                                            {result.type === 'LEAD' && <Badge color="gray" size="sm" className="ml-2">{result.data.status}</Badge>}
                                            {result.type === 'TASK' && <Badge color="gray" size="sm" className="ml-2">{result.data.status}</Badge>}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {result.type === 'LEAD' ? result.data.company : (result.data.description || 'No description')}
                                        </p>
                                    </div>
                                    <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                                </div>
                            ))}
                        </div>
                    )}
                    {!query.trim() && (
                        <div className="p-8 text-center text-zinc-400 text-sm">
                            Type to search leads and tasks...
                        </div>
                    )}
                </div>

                <div className="p-2 border-t border-zinc-100 bg-zinc-50/50 text-[10px] text-zinc-400 flex justify-end space-x-3 px-4">
                    <span><strong className="font-medium text-zinc-500">↑↓</strong> to navigate</span>
                    <span><strong className="font-medium text-zinc-500">Enter</strong> to select</span>
                    <span><strong className="font-medium text-zinc-500">Esc</strong> to close</span>
                </div>

            </div>
        </div>
    );
};
