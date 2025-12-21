import React from 'react';
import { GlassCard, Button } from './ui/GlassComponents';
import { User, Bell } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl animate-in fade-in duration-300">
       <div className="mb-8 pb-2 border-b border-zinc-100">
          <h1 className="text-xl font-medium text-zinc-900">Settings</h1>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-medium text-zinc-900 mb-6 flex items-center"><User size={16} className="mr-2 text-zinc-500"/> Profile</h3>
            <div className="flex items-start space-x-6">
              <div className="relative group cursor-pointer">
                <img src="https://picsum.photos/100/100" className="w-16 h-16 rounded-full object-cover ring-1 ring-zinc-200" alt="Profile" />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white">Edit</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">First Name</label>
                      <input type="text" defaultValue="John" className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-800 outline-none" />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-800 outline-none" />
                   </div>
                </div>
                 <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email</label>
                      <input type="email" defaultValue="john.doe@example.com" className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-800 outline-none" />
                 </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end pt-4 border-t border-zinc-50">
              <Button>Save Changes</Button>
            </div>
          </GlassCard>

          <GlassCard>
             <h3 className="font-medium text-zinc-900 mb-4 flex items-center"><Bell size={16} className="mr-2 text-zinc-500"/> Notifications</h3>
             <div className="space-y-3">
                {['Email me when a lead is assigned', 'Email me on weekly pipeline summaries', 'Browser notifications'].map((label, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900" />
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900">{label}</span>
                  </label>
                ))}
             </div>
          </GlassCard>
        </div>
    </div>
  );
};