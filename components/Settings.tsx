import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { GlassCard, Button } from './ui/GlassComponents';
import { User, Bell, Loader2, Save, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, email, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '', // Fallback to auth email if profile email is empty
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data!', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: formData.full_name,
        email: formData.email, // Updating profile email, not auth email
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3s
    } catch (error) {
      console.error('Error updating the data!', error);
      alert('Error updating profile!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-zinc-400" /></div>;
  }

  return (
    <div className="max-w-3xl animate-in fade-in duration-300">
      <div className="mb-8 pb-2 border-b border-zinc-100 flex justify-between items-center">
        <h1 className="text-xl font-medium text-zinc-900">Settings</h1>
        {showSuccess && (
          <span className="text-sm text-emerald-600 flex items-center bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-4">
            <Check size={14} className="mr-1.5" /> Saved successfully
          </span>
        )}
      </div>

      <div className="space-y-6">
        <GlassCard>
          <h3 className="font-medium text-zinc-900 mb-6 flex items-center"><User size={16} className="mr-2 text-zinc-500" /> Profile</h3>
          <div className="flex items-start space-x-6">
            <div className="relative group cursor-pointer shrink-0">
              {/* Fallback avatar */}
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center ring-1 ring-zinc-200 overflow-hidden">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-zinc-400" size={32} />
                )}
              </div>
              {/* <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white">Edit</span>
                </div> */}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email (Profile)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
                  placeholder="john@example.com"
                />
                <p className="text-[10px] text-zinc-400 mt-1">This email is used for notifications and display. It does not change your login email.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end pt-4 border-t border-zinc-50">
            <Button onClick={updateProfile} disabled={saving}>
              {saving ? <><Loader2 size={14} className="animate-spin mr-2" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-medium text-zinc-900 mb-4 flex items-center"><Bell size={16} className="mr-2 text-zinc-500" /> Notifications</h3>
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