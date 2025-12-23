import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { PIPELINE_COLUMNS } from '../constants';
import { Badge, Button } from './ui/GlassComponents';

interface PipelineProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, newStatus: PipelineStage) => void;
  onAddLead?: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (id: string) => void;
}

export const Pipeline: React.FC<PipelineProps> = ({ leads, onUpdateLeadStatus, onAddLead, onEditLead, onDeleteLead }) => {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  // Group leads by stage
  const leadsByStage = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) acc[lead.status] = [];
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<PipelineStage, Lead[]>);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLead(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (draggedLead) {
      onUpdateLeadStatus(draggedLead, stage);
      setDraggedLead(null);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-medium text-zinc-900">Pipeline</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button size="sm" onClick={onAddLead}><Plus size={16} className="mr-1" /> New Deal</Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex space-x-0 h-full min-w-max">
          {PIPELINE_COLUMNS.map((stage) => {
            const stageLeads = leadsByStage[stage] || [];
            const stageValue = stageLeads.reduce((acc, lead) => acc + lead.value, 0);

            return (
              <div
                key={stage}
                className="flex flex-col w-80 h-full border-r border-dashed border-zinc-200 px-3 first:pl-0 last:border-r-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-zinc-900">{stage}</h3>
                    <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px]">{stageLeads.length}</span>
                  </div>
                  {stageValue > 0 && (
                    <div className="text-[11px] text-zinc-400">
                      ${(stageValue / 1000).toFixed(1)}k
                    </div>
                  )}
                </div>

                {/* Drop Zone */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {stageLeads.map((lead) => (
                      <KanbanCard
                        key={lead.id}
                        lead={lead}
                        isDragging={draggedLead === lead.id}
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onEdit={() => onEditLead?.(lead)}
                        onDelete={() => onDeleteLead?.(lead.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {stageLeads.length === 0 && (
                    <div className="h-full bg-zinc-50/30 rounded-md"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const KanbanCard: React.FC<{
  lead: Lead;
  onDragStart: (e: any) => void;
  isDragging: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ lead, onDragStart, isDragging, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: isDragging ? 0.98 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'tween', duration: 0.15 }}
      draggable
      onDragStart={onDragStart}
      className={`bg-white p-3 rounded-md border border-zinc-200 shadow-sm mb-3 cursor-grab active:cursor-grabbing hover:border-zinc-300 hover:shadow-md transition-all group relative`}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="flex justify-between items-start mb-1.5">
        <span className="text-xs font-medium text-zinc-500">{lead.company}</span>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            className="text-zinc-300 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          >
            <MoreHorizontal size={14} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-zinc-200 rounded shadow-lg z-50 py-1 flex flex-col">
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
        </div>
      </div>

      <h4 className="text-sm font-medium text-zinc-900 mb-3">{lead.name}</h4>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
        <Badge color={lead.value > 10000 ? 'gray' : 'gray'}>
          ${lead.value.toLocaleString()}
        </Badge>
        {lead.avatar && <img src={lead.avatar} alt="Avatar" className="w-5 h-5 rounded-full grayscale opacity-70" />}
      </div>
    </motion.div>
  );
};