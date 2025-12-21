import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Pipeline } from './components/Pipeline';
import { Leads } from './components/Leads';
import { Billing } from './components/Billing';
import { Settings } from './components/Settings';
import { MOCK_LEADS } from './constants';
import { Lead, PipelineStage, ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  // Function to update lead status (used in Pipeline view)
  const handleUpdateLeadStatus = (id: string, newStatus: PipelineStage) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard leads={leads} />;
      case 'PIPELINE':
        return <Pipeline leads={leads} onUpdateLeadStatus={handleUpdateLeadStatus} />;
      case 'LEADS':
        return <Leads leads={leads} />;
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
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="max-w-screen-2xl mx-auto p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;