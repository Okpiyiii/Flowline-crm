import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './src/lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Pipeline } from './components/Pipeline';
import { Leads } from './components/Leads';
import { Billing } from './components/Billing';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { CreateLeadModal } from './components/CreateLeadModal';
import { Lead, PipelineStage, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const Workspace: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        fetchLeads();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads(data as unknown as Lead[] || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: PipelineStage) => {
    // Optimistic update
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      fetchLeads(); // Revert on error
    }
  };

  const handleAddLead = async (leadData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newLead = {
      ...leadData,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setLeads(prev => [...prev, data as unknown as Lead]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      );
    }

    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard leads={leads} />;
      case 'PIPELINE':
        return <Pipeline leads={leads} onUpdateLeadStatus={handleUpdateLeadStatus} onAddLead={() => setIsCreateModalOpen(true)} />;
      case 'LEADS':
        return <Leads leads={leads} onAddLead={() => setIsCreateModalOpen(true)} />;
      case 'BILLING':
        return <Billing />;
      case 'SETTINGS':
        return <Settings />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onSignOut={handleSignOut}
        onAddLead={() => setIsCreateModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="max-w-screen-2xl mx-auto p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth mode="LOGIN" />} />
        <Route path="/signup" element={<Auth mode="SIGNUP" />} />
        <Route path="/app/*" element={<Workspace />} />
        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;