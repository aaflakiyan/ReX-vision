
export enum DisassemblyStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PLANNING = 'PLANNING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface DisassemblyStep {
  stepId: number;
  action: string;
  component: string;
  tool: string;
  roboticMotion: string;
  torqueLimit: number;
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasoning: string;
  // New Automation Fields
  automationScore: number; // 0-100
  recommendedRobot: 'INDUSTRIAL_ARM' | 'COBOT' | 'MOBILE_ROBOT' | 'GANTRY_SYSTEM' | 'HUMAN_ONLY';
  endOfArmTooling: string; // e.g. "Vacuum Gripper", "Soft Fingers", "Impact Driver"
  timeEstimateSeconds: number;
  verificationNote: string; // Specific industrial reference to validate feasibility
}

export interface MaterialComposition {
  material: string;
  percentage: number;
  estimatedValueUsd: number;
  recyclability: number;
}

export interface CircularStrategy {
  strategy: 'REUSE' | 'REPAIR' | 'REMANUFACTURE' | 'RECYCLE' | 'DISPOSAL';
  confidenceScore: number;
  economicViability: 'PROFITABLE' | 'BREAK_EVEN' | 'LOSS';
  reasoning: string;
  marketDemand: 'LOW' | 'MEDIUM' | 'HIGH';
  interventionType: string;
}

export interface Citation {
  uri: string;
  title: string;
}

export interface DisciplineBreakdown {
  roboticsAndAutomation: number; // %
  chemicalProcessing: number; // %
  manualLabor: number; // %
  logisticsAndTransport: number; // %
}

export interface AnalysisResult {
  deviceName: string;
  complexityScore: number;
  steps: DisassemblyStep[];
  materials: MaterialComposition[];
  generatedCode: string;
  summary: string;
  circularStrategy: CircularStrategy;
  citations: Citation[];
  dataQualityWarning?: string;
  // New High-Level Automation Metrics
  disciplineBreakdown: DisciplineBreakdown;
  primaryAutomationChallenge: string;
}
