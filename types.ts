export enum PipelineStage {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  WON = 'Won',
  LOST = 'Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: PipelineStage;
  value: number;
  owner: string;
  source: string;
  createdAt: string;
  avatar?: string;
}

export interface KPI {
  label: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
}

export type ViewState = 'DASHBOARD' | 'PIPELINE' | 'LEADS' | 'BILLING' | 'SETTINGS';
