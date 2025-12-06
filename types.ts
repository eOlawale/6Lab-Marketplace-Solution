export enum AgentPersona {
  DEVELOPER = 'DEVELOPER',
  LOGISTICS = 'LOGISTICS',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  SALES_ANALYST = 'SALES_ANALYST',
  CONTENT_MANAGER = 'CONTENT_MANAGER'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: GroundingMetadata;
  isError?: boolean;
}

export interface GroundingMetadata {
  searchChunks?: {
    uri: string;
    title: string;
  }[];
  mapChunks?: {
    uri: string;
    title: string;
    source: string;
  }[];
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  icon: any;
  color: string;
}