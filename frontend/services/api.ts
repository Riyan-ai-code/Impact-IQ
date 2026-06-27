import { Repository, SecurityFinding, DependencyNode, DiffAnalysisReport } from '@/types'

// Mock database
const mockRepositories: Repository[] = [
  {
    id: 'payment-service',
    name: 'payment-service',
    url: 'github.com/impact-iq/payment-service',
    health: 'critical',
    healthScore: 58,
    riskScore: 92,
    findingsCount: 42,
    criticalCount: 8,
    lastAnalysis: '2026-06-28T01:30:00Z',
    language: 'TypeScript / Node.js'
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    url: 'github.com/impact-iq/auth-service',
    health: 'at_risk',
    healthScore: 72,
    riskScore: 85,
    findingsCount: 28,
    criticalCount: 4,
    lastAnalysis: '2026-06-27T18:45:00Z',
    language: 'Go'
  },
  {
    id: 'order-service',
    name: 'order-service',
    url: 'github.com/impact-iq/order-service',
    health: 'healthy',
    healthScore: 86,
    riskScore: 74,
    findingsCount: 15,
    criticalCount: 1,
    lastAnalysis: '2026-06-28T00:15:00Z',
    language: 'Kotlin / Spring'
  },
  {
    id: 'user-service',
    name: 'user-service',
    url: 'github.com/impact-iq/user-service',
    health: 'healthy',
    healthScore: 91,
    riskScore: 68,
    findingsCount: 9,
    criticalCount: 0,
    lastAnalysis: '2026-06-26T22:10:00Z',
    language: 'TypeScript / Express'
  },
  {
    id: 'inventory-service',
    name: 'inventory-service',
    url: 'github.com/impact-iq/inventory-service',
    health: 'healthy',
    healthScore: 95,
    riskScore: 52,
    findingsCount: 4,
    criticalCount: 0,
    lastAnalysis: '2026-06-27T12:00:00Z',
    language: 'Python / FastAPI'
  }
]

const mockDependencyNodes: DependencyNode[] = [
  {
    id: 'gateway',
    name: 'api-gateway',
    type: 'service',
    status: 'healthy',
    version: 'v2.4.1',
    connections: ['auth-service', 'user-service', 'order-service', 'payment-service'],
    dependents: []
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    type: 'service',
    status: 'at_risk',
    version: 'v1.12.0',
    connections: ['user-service', 'redis-auth'],
    dependents: ['gateway']
  },
  {
    id: 'user-service',
    name: 'user-service',
    type: 'service',
    status: 'healthy',
    version: 'v3.1.2',
    connections: ['user-db'],
    dependents: ['gateway', 'auth-service']
  },
  {
    id: 'order-service',
    name: 'order-service',
    type: 'service',
    status: 'healthy',
    version: 'v1.4.0',
    connections: ['payment-service', 'inventory-service', 'order-db'],
    dependents: ['gateway']
  },
  {
    id: 'payment-service',
    name: 'payment-service',
    type: 'service',
    status: 'critical',
    version: 'v2.8.5',
    connections: ['stripe-api', 'payment-db', 'auth-service'],
    dependents: ['gateway', 'order-service']
  },
  {
    id: 'inventory-service',
    name: 'inventory-service',
    type: 'service',
    status: 'healthy',
    version: 'v1.0.4',
    connections: ['inventory-db'],
    dependents: ['order-service']
  },
  {
    id: 'user-db',
    name: 'user-mongodb',
    type: 'database',
    status: 'healthy',
    version: '6.0.5',
    connections: [],
    dependents: ['user-service']
  },
  {
    id: 'order-db',
    name: 'order-postgresql',
    type: 'database',
    status: 'healthy',
    version: '15.2',
    connections: [],
    dependents: ['order-service']
  },
  {
    id: 'payment-db',
    name: 'payment-mysql',
    type: 'database',
    status: 'healthy',
    version: '8.0',
    connections: [],
    dependents: ['payment-service']
  },
  {
    id: 'inventory-db',
    name: 'inventory-redis',
    type: 'database',
    status: 'healthy',
    version: '7.0',
    connections: [],
    dependents: ['inventory-service']
  },
  {
    id: 'redis-auth',
    name: 'session-cache',
    type: 'database',
    status: 'healthy',
    version: '7.0',
    connections: [],
    dependents: ['auth-service']
  },
  {
    id: 'stripe-api',
    name: 'stripe-gateway',
    type: 'api',
    status: 'healthy',
    version: 'v3 (external)',
    connections: [],
    dependents: ['payment-service']
  }
]

const mockSecurityFindings: SecurityFinding[] = [
  {
    id: 'SEC-001',
    title: 'SQL Injection Vulnerability in Custom Query Engine',
    severity: 'critical',
    service: 'payment-service',
    filePath: 'services/db.ts',
    lineNumber: 42,
    description: 'Raw SQL template literal concat allows arbitrary inputs to bypass sanitization. The query executes directly without parameterized bindings.',
    recommendation: 'Replace dynamic raw template strings with parameterized SQL queries using knex or mongoose parameters.',
    detectedBy: 'Static Code Analyzer (Deterministic)'
  },
  {
    id: 'SEC-002',
    title: 'JWT Secret Hardcoded in Configuration File',
    severity: 'critical',
    service: 'auth-service',
    filePath: 'config/jwt.ts',
    lineNumber: 12,
    description: 'Found plaintext value in key-mapping "JWT_SECRET = \'super-secret-key-123!\'". This value is exposed in git version history.',
    recommendation: 'Migrate secrets to environment variables or GCP/AWS Secrets Manager. Rotate existing secret keys.',
    detectedBy: 'Secret Scanner (Deterministic)'
  },
  {
    id: 'SEC-003',
    title: 'Missing Rate Limiting on Authentication API',
    severity: 'medium',
    service: 'auth-service',
    filePath: 'routes/auth.ts',
    lineNumber: 24,
    description: 'The endpoint `/api/auth/login` does not restrict requests, exposing the service to brute-force credential stuffing attacks.',
    recommendation: 'Apply standard rate-limiting middleware (e.g., express-rate-limit) with sliding-window policy.',
    detectedBy: 'OpenAPI Analyzer (Deterministic)'
  }
]

const mockPredefinedDiffs = [
  {
    id: 'diff-1',
    label: 'Refactor Payment Gateway API (Schema Breaking Change)',
    diff: `diff --git a/services/payment.ts b/services/payment.ts
index b1543..f8910 100644
--- a/services/payment.ts
+++ b/services/payment.ts
@@ -12,5 +12,5 @@ export interface ChargeRequest {
-  amount: number; // in cents
-  currency: string;
+  charge_amount: number; // renamed for naming conventions
+  currency: 'USD' | 'EUR' | 'GBP'; // strict type union
   token: string;
 }
 
 export async function createCharge(req: ChargeRequest) {
-  return stripe.charges.create({ amount: req.amount, currency: req.currency });
+  return stripe.charges.create({ amount: req.charge_amount, currency: req.currency });
 }`
  },
  {
    id: 'diff-2',
    label: 'Update JWT Authentication Secrets Configuration (Security Fix)',
    diff: `diff --git a/config/jwt.ts b/config/jwt.ts
index c4561..a7890 100644
--- a/config/jwt.ts
+++ b/config/jwt.ts
@@ -10,3 +10,3 @@
 export const JWT_CONFIG = {
-  secret: "super-secret-key-123!", // Hardcoded fallback secret
+  secret: process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET environment variable is missing") })(),
   expiresIn: "24h"
 };`
  },
  {
    id: 'diff-3',
    label: 'Standard CSS Layout Alignment Fix (Low Risk)',
    diff: `diff --git a/components/Header.tsx b/components/Header.tsx
index 45ad2..90bfd 100644
--- a/components/Header.tsx
+++ b/components/Header.tsx
@@ -5,3 +5,3 @@ export function Header() {
   return (
-    <header className="flex justify-between items-center p-4">
+    <header className="flex justify-between items-center p-5 shadow-sm">
       <Logo />`
  }
]

export const ApiService = {
  getRepositories: async (): Promise<Repository[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockRepositories]
  },

  getRepository: async (id: string): Promise<Repository | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 150))
    return mockRepositories.find(r => r.id === id)
  },

  getDependencyNodes: async (): Promise<DependencyNode[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockDependencyNodes]
  },

  getSecurityFindings: async (): Promise<SecurityFinding[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...mockSecurityFindings]
  },

  getPredefinedDiffs: () => {
    return mockPredefinedDiffs
  },

  // Simulates our deterministic pipelines & AI Explanations
  runDiffAnalysis: async (repositoryId: string, diffText: string): Promise<DiffAnalysisReport> => {
    await new Promise(resolve => setTimeout(resolve, 1800)) // Simulation delay for pipeline run

    const repo = mockRepositories.find(r => r.id === repositoryId) || mockRepositories[0]

    // Determine details based on diff contents
    let riskScore = 15
    let status: 'success' | 'warning' | 'failed' = 'success'
    let securityFindings: SecurityFinding[] = []
    let breakingChanges: any[] = []
    let dependencies: any[] = []
    let aiExplanation: AIExplanation

    if (diffText.includes('amount') && diffText.includes('charge_amount')) {
      // Breaking payment API change
      riskScore = 92
      status = 'failed'
      breakingChanges = [
        {
          file: 'services/payment.ts',
          line: 12,
          apiName: 'createCharge',
          changeType: 'Field Renamed (Breaking API Change)',
          impactedConsumers: ['order-service', 'mobile-app', 'web-portal']
        }
      ]
      dependencies = [
        {
          id: 'DEP-001',
          type: 'breaking_api',
          description: 'payment-service alters the ChargeRequest structure, renaming "amount" to "charge_amount"',
          impact: 'Critical: any consumer invoking payment-service createCharge API with amount will fail with a 400 Bad Request error.'
        }
      ]
      aiExplanation = {
        executiveSummary: 'This deployment presents a critical risk (Score: 92/100) due to a breaking schema modification in the payment processing gateway endpoint.',
        engineeringExplanation: 'The API field name "amount" in ChargeRequest interface is renamed to "charge_amount". As order-service and other consumer clients query payment-service using the previous interface contract, executing this deployment will break payment creation downstream immediately.',
        riskExplanation: 'Deploying this change as-is will result in 100% transaction failure rates on checkout processes, as the orders service is not yet synchronized to send "charge_amount". The blast radius covers checkout, cart management, and payment reconciliation modules.',
        deploymentAdvice: 'Do NOT deploy this commit. Implement a multi-phase roll out: (1) Add "charge_amount" as an optional field alongside "amount", (2) Update client consumers to use "charge_amount", (3) Make the field required and clean up the old field.',
        remediationSuggestions: [
          'Create a backward-compatible adapter mapping the old key "amount" to "charge_amount" temporarily in payment-service controller validation.',
          'Coordinate deployment with order-service release v1.4.1.',
          'Add TypeScript compilation verification tests matching API specs between payment and order services.'
        ]
      }
    } else if (diffText.includes('secret') || diffText.includes('JWT_SECRET')) {
      // Security fix
      riskScore = 35
      status = 'warning'
      securityFindings = [
        {
          id: 'SEC-004',
          title: 'Exposed Secret Removal & Environment Configuration',
          severity: 'low',
          service: 'auth-service',
          filePath: 'config/jwt.ts',
          lineNumber: 12,
          description: 'The code removes a hardcoded secret credentials string and fallback to process.env config.',
          recommendation: 'Verify that the JWT_SECRET environment variable is defined in the production config cluster before rolling out.',
          detectedBy: 'Secrets Audit Scanner (Deterministic)'
        }
      ]
      aiExplanation = {
        executiveSummary: 'This deployment is marked as moderate risk (Score: 35/100) due to secret rotation and environment loading updates.',
        engineeringExplanation: 'A hardcoded security string is replaced by dynamic loading via environment variable config processes. This closes an active high security vulnerability, but raises a small operational deployment risk if environment variables are not correctly configured.',
        riskExplanation: 'If JWT_SECRET is not correctly populated in the environment of target nodes, the auth-service container will crash-loop during startup because of the configuration fallback exception.',
        deploymentAdvice: 'Deploy with caution. Verify JWT_SECRET keys in vault environments before scaling containers.',
        remediationSuggestions: [
          'Ensure the target environment variables are loaded in Railway/Render dashboard.',
          'Verify container startup logs in sandbox environment before triggering staging release.'
        ]
      }
    } else {
      // Low risk bugfix/formatting
      riskScore = 12
      status = 'success'
      aiExplanation = {
        executiveSummary: 'This deployment is clean and poses minimal risk (Score: 12/100). No breaking schema changes, dependency breaks, or security concerns detected.',
        engineeringExplanation: 'The modifications are restricted to local React components styling attributes and page layout adjustments in Header.tsx. No backend integration paths, databases, or API signatures were modified.',
        riskExplanation: 'Low operational risk. The change is local to UI rendering assets.',
        deploymentAdvice: 'Safe to deploy. Go ahead and approve the release.',
        remediationSuggestions: [
          'Run simple manual regression on mobile headers UI to verify shadow consistency.'
        ]
      }
    }

    return {
      id: `rep-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      repositoryName: repo.name,
      branch: 'main',
      commitHash: '8b9c24d1a58679f298c2534a',
      author: 'Arjun Dev',
      timestamp: new Date().toISOString(),
      riskScore,
      status,
      gitDiff: diffText,
      changesSummary: {
        filesChanged: 1,
        insertions: diffText.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).length,
        deletions: diffText.split('\n').filter(l => l.startsWith('-') && !l.startsWith('---')).length,
        impactedAPIsCount: breakingChanges.length,
        impactedServicesCount: breakingChanges.length > 0 ? 3 : 0
      },
      findings: {
        security: securityFindings,
        dependency: dependencies,
        breakingChanges
      },
      aiExplanation
    }
  }
}
export default ApiService
