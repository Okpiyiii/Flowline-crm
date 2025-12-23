import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Kanban, Users, CreditCard, Settings, LogOut, Command, User, CheckSquare } from 'lucide-react';
import { ViewState } from '../types';
import { supabase } from '../src/lib/supabase';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut?: () => void;
  onAddLead?: () => void;
  onSearchClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onSignOut, onAddLead, onSearchClick }) => {
  const [profile, setProfile] = useState<{ full_name: string | null, avatar_url: string | null }>({ full_name: 'Loading...', avatar_url: null });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []); // Re-fetch could be improved with global state, but simple fetch works for now

  const menuItems = [
    { id: 'DASHBOARD' as ViewState, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'PIPELINE' as ViewState, icon: Kanban, label: 'Pipeline' },
    { id: 'LEADS' as ViewState, icon: Users, label: 'Leads' },
    { id: 'TASKS' as ViewState, icon: CheckSquare, label: 'Tasks' },
    { id: 'BILLING' as ViewState, icon: CreditCard, label: 'Billing' },
    { id: 'SETTINGS' as ViewState, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-60 h-screen sticky top-0 flex flex-col border-r border-zinc-200 bg-white z-50">
      <div className="p-4 mb-2">
        <div className="flex items-center space-x-2 mb-4 px-1">
          <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white">
            <Command size={14} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">Flowline</span>
        </div>

        <button
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-zinc-50 border border-zinc-200/50 rounded-md text-sm text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 transition-all group shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Command size={14} className="text-zinc-400 group-hover:text-zinc-600" />
            <span>Search...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-200 rounded bg-white font-sans">⌘K</kbd>
        </button>
      </div>

      <div className="px-3 mb-2">
        <button
          onClick={onAddLead}
          className="w-full flex items-center justify-center space-x-2 bg-zinc-900 text-white rounded-md py-2 text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          {/* <Plus size={16} /> */}
          <span>New Lead</span>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-150 group ${isActive
                ? 'bg-zinc-100 text-zinc-900 font-medium'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
            >
              <item.icon size={16} className={`transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-100">
        <div
          onClick={onSignOut}
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-medium text-xs overflow-hidden">
            {profile.avatar_url ? (
              profile.avatar_url.startsWith('http') ? (
                <img src={profile.avatar_url} alt="Ava" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">{profile.avatar_url}</span>
              )
            ) : (
              <User size={14} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 truncate">{profile.full_name || 'User'}</p>
            <p className="text-xs text-zinc-400 truncate">Pro Workspace</p>
          </div>
          <LogOut size={14} className="text-zinc-400 hover:text-zinc-700" />
        </div>
      </div>
    </aside>
  );
};