import React, { useState, useRef } from 'react';
import { Search, Filter, MoreHorizontal, Plus, Download, Upload, Loader2, Check } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { Button, Badge } from './ui/GlassComponents';
import Papa from 'papaparse';
import { supabase } from '../src/lib/supabase';

interface LeadsProps {
  leads: Lead[];
  onAddLead?: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (id: string) => void;
  onUpdateLeadStatus?: (id: string, status: PipelineStage) => void;
}

export const Leads: React.FC<LeadsProps> = ({ leads, onAddLead, onEditLead, onDeleteLead, onUpdateLeadStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // Basic CSV Export
    const csv = Papa.unparse(leads.map(l => ({
      Name: l.name,
      Company: l.company,
      Email: l.email,
      Phone: l.phone,
      Value: l.value,
      Status: l.status,
      Source: l.source,
      Created: l.createdAt
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const newLeads = results.data.map((row: any) => {
            if (!row.Name) return null; // Skip empty rows
            return {
              user_id: user.id,
              name: row.Name || row.name || 'Unknown',
              company: row.Company || row.company || '',
              email: row.Email || row.email || '',
              phone: row.Phone || row.phone || '',
              value: parseFloat(row.Value || row.value || '0'),
              status: row.Status || row.status || 'New',
              source: 'Import'
            };
          }).filter(l => l !== null);

          if (newLeads.length > 0) {
            const { error } = await supabase.from('leads').insert(newLeads);
            if (error) throw error;
            setImportSuccess(`Imported ${newLeads.length} leads successfully!`);
            setTimeout(() => setImportSuccess(null), 3000);
            // Trigger a refresh somehow? The App component subscribes to realtime, so it might just work if we rely on that.
            // If not, we might need a manual refresh callback. For now, let's assume realtime or manual reload.
            // Actually, App.tsx fetches leads. Realtime might pick it up.
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing leads. Check console for details.');
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-medium text-zinc-900">Leads</h1>
          {importSuccess && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center animate-in fade-in">
              <Check size={12} className="mr-1" /> {importSuccess}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          <Button variant="outline" size="sm" onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 size={16} className="animate-spin mr-1" /> : <Upload size={16} className="mr-1" />}
            Import
          </Button>
          <Button size="sm" onClick={onAddLead}><Plus size={16} className="mr-1" /> Add Lead</Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all placeholder:text-zinc-400"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8"><Filter size={14} className="mr-2" /> View</Button>
            <Button variant="outline" size="sm" className="h-8" onClick={handleExport}><Download size={14} className="mr-2" /> Export</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_0_rgba(228,228,231,1)]">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredLeads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onStatusChange={(status) => onUpdateLeadStatus?.(lead.id, status)}
                  onEdit={() => onEditLead?.(lead)}
                  onDelete={() => onDeleteLead?.(lead.id)}
                />
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
              <p className="text-sm">No leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LeadRow: React.FC<{ lead: Lead; onStatusChange?: (s: PipelineStage) => void; onEdit?: () => void; onDelete?: () => void }> = ({ lead, onStatusChange, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions: PipelineStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  return (
    <tr className="hover:bg-zinc-50 transition-colors group relative" onMouseLeave={() => { setShowDropdown(false); setShowStatusDropdown(false); }}>
      <td className="px-4 py-3">
        <input type="checkbox" className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center space-x-3">
          {lead.avatar ? (
            <img src={lead.avatar} alt="" className="w-6 h-6 rounded-full grayscale opacity-80" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-100"></div>
          )}
          <div>
            <div className="font-medium text-zinc-900 text-sm">{lead.name}</div>
            <div className="text-xs text-zinc-400">{lead.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5 text-zinc-600">{lead.company}</td>
      <td className="px-4 py-2.5 relative">
        <div
          onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
          className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
        >
          <Badge color={lead.status === 'Won' ? 'green' : lead.status === 'Lost' ? 'red' : 'gray'}>
            {lead.status}
          </Badge>
        </div>

        {showStatusDropdown && (
          <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-zinc-200 rounded shadow-lg z-50 py-1 flex flex-col text-left animate-in fade-in zoom-in-95 duration-100">
            {statusOptions.map(option => (
              <button
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(option);
                  setShowStatusDropdown(false);
                }}
                className={`text-left px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors w-full flex items-center ${lead.status === option ? 'font-medium text-blue-600 bg-blue-50' : 'text-zinc-700'}`}
              >
                {lead.status === option && <Check size={10} className="mr-1.5" />}
                {option}
              </button>
            ))}
          </div>
        )}
      </td>
      <td className="px-4 py-2.5 font-medium text-zinc-700 text-sm">${lead.value.toLocaleString()}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-[10px] font-medium border border-zinc-200">JD</div>
          <span className="text-zinc-500 text-xs">John Doe</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-right relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
          className="text-zinc-300 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all p-1"
        >
          <MoreHorizontal size={14} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-zinc-200 rounded shadow-lg z-50 py-1 flex flex-col text-left">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onEdit?.(); }}
              className="text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors w-full"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onDelete?.(); }}
              className="text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};