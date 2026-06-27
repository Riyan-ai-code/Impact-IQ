export interface Repository {
  id: string
  name: string
  url: string
  health: 'healthy' | 'at_risk' | 'critical'
  healthScore: number
  riskScore: number
  findingsCount: number
  criticalCount: number
  lastAnalysis: string
  language: string
}

export interface SecurityFinding {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  service: string
  filePath: string
  lineNumber: number
  description: string
  recommendation: string
  detectedBy: string
}

export interface DependencyNode {
  id: string
  name: string
  type: 'service' | 'library' | 'database' | 'api'
  status: 'healthy' | 'at_risk' | 'critical'
  version: string
  connections: string[] // IDs of nodes it depends on
  dependents: string[] // IDs of nodes that depend on it
}

export interface AIExplanation {
  executiveSummary: string
  engineeringExplanation: string
  riskExplanation: string
  deploymentAdvice: string
  remediationSuggestions: string[]
}

export interface DiffAnalysisReport {
  id: string
  repositoryId: string
  repositoryName: string
  branch: string
  commitHash: string
  author: string
  timestamp: string
  riskScore: number
  status: 'success' | 'warning' | 'failed'
  gitDiff: string
  changesSummary: {
    filesChanged: number
    insertions: number
    deletions: number
    impactedAPIsCount: number
    impactedServicesCount: number
  }
  findings: {
    security: SecurityFinding[]
    dependency: {
      id: string
      type: string
      description: string
      impact: string
    }[]
    breakingChanges: {
      file: string
      line: number
      apiName: string
      changeType: string
      impactedConsumers: string[]
    }[]
  }
  aiExplanation: AIExplanation
}
