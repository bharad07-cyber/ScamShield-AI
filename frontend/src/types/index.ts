export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ScanType = 'Message' | 'Website' | 'Email' | 'QR Code' | 'Image' | 'Phone';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface ScanResult {
  scamProbability: number;
  riskLevel: RiskLevel;
  emotionalManipulationScore?: number;
  urgencyScore?: number;
  moneyScamScore?: number;
  identityTheftProbability?: number;
  brandImpersonationScore?: number;
  suspiciousLinksScore?: number;
  confidenceScore?: number;
  aiVerdict?: string;
  highlightedPhrases?: string[];
  explanation: string;
  reasoning?: string[];
  recommendedActions?: string[];
  similarScamPatterns?: string[];
  // For Website
  overallTrustScore?: number;
  domainAgeDays?: number;
  isHttps?: boolean;
  typosquattingDetected?: boolean;
  impersonatedBrand?: string;
  sslStatus?: string;
  redirectChain?: string[];
  riskFlags?: string[];
  // For Email
  senderDomain?: string;
  isSpoofed?: boolean;
  flaggedAttachments?: string[];
  emailSections?: Array<{ title: string; status: string; details: string }>;
  // For Phone
  carrier?: string;
  location?: string;
  spamReports?: number;
  fraudReports?: number;
  category?: string;
  communityTrustScore?: number;
  recentReports?: Array<{ date: string; comment: string; tag: string }>;
}

export interface ScanItem {
  id: string;
  type: ScanType;
  target: string;
  timestamp: string;
  riskLevel: RiskLevel;
  scamProbability: number;
  result: ScanResult;
  isFavorite?: boolean;
  isDeleted?: boolean;
  platform?: string;
}

export interface ThreatItem {
  id: string;
  title: string;
  category: string;
  severity: RiskLevel;
  description: string;
  affectedCount: number;
  reportedAt: string;
  status: string;
  mitigation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
