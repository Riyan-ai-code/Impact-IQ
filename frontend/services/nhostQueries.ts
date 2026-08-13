import { nhost } from "@/lib/nhost"

// ====================================================
// 1. PROJECTS GRAPHQL QUERIES & MUTATIONS
// ====================================================

export const GET_PROJECTS_QUERY = `
  query GetProjects {
    projects(order_by: { created_at: desc }) {
      id
      name
      description
      repository
      branch
      team
      security_analysis
      dependency_analysis
      api_analysis
      created_at
    }
  }
`

export const INSERT_PROJECT_MUTATION = `
  mutation InsertProject($name: String!, $description: String, $repository: String!, $branch: String, $team: String) {
    insert_projects_one(object: {
      name: $name,
      description: $description,
      repository: $repository,
      branch: $branch,
      team: $team
    }) {
      id
      name
      repository
      created_at
    }
  }
`

export const DELETE_PROJECT_MUTATION = `
  mutation DeleteProject($id: uuid!) {
    delete_projects_by_pk(id: $id) {
      id
      name
    }
  }
`

// ====================================================
// 2. TEAMS GRAPHQL QUERIES & MUTATIONS
// ====================================================

export const GET_TEAMS_QUERY = `
  query GetTeams {
    teams(order_by: { created_at: desc }) {
      id
      name
      description
      lead
      created_at
      team_members {
        id
        name
        email
        role
        status
        joined_at
      }
    }
  }
`

export const INSERT_TEAM_MUTATION = `
  mutation InsertTeam($name: String!, $description: String) {
    insert_teams_one(object: {
      name: $name,
      description: $description
    }) {
      id
      name
      created_at
    }
  }
`

export const DELETE_TEAM_MUTATION = `
  mutation DeleteTeam($id: uuid!) {
    delete_teams_by_pk(id: $id) {
      id
    }
  }
`

// ====================================================
// 3. TEAM MEMBERS GRAPHQL QUERIES & MUTATIONS
// ====================================================

export const INSERT_TEAM_MEMBER_MUTATION = `
  mutation InsertTeamMember($team_id: uuid!, $name: String!, $email: String!, $role: String) {
    insert_team_members_one(object: {
      team_id: $team_id,
      name: $name,
      email: $email,
      role: $role,
      status: "pending"
    }) {
      id
      name
      email
      role
    }
  }
`

export const DELETE_TEAM_MEMBER_MUTATION = `
  mutation DeleteTeamMember($id: uuid!) {
    delete_team_members_by_pk(id: $id) {
      id
    }
  }
`

// ====================================================
// 4. ANALYSES GRAPHQL QUERIES & MUTATIONS
// ====================================================

export const GET_ANALYSES_QUERY = `
  query GetAnalyses {
    analyses(order_by: { created_at: desc }) {
      id
      repository
      branch
      mode
      ai_model
      risk_score
      risk_level
      user_prompt
      ai_response
      summary
      security_issues
      api_contract_issues
      checklist
      created_at
    }
  }
`

export const INSERT_ANALYSIS_MUTATION = `
  mutation InsertAnalysis(
    $repository: String!,
    $branch: String!,
    $mode: String,
    $ai_model: String,
    $risk_score: Int,
    $risk_level: String,
    $user_prompt: String,
    $ai_response: String,
    $summary: jsonb,
    $security_issues: jsonb,
    $api_contract_issues: jsonb,
    $checklist: jsonb
  ) {
    insert_analyses_one(object: {
      repository: $repository,
      branch: $branch,
      mode: $mode,
      ai_model: $ai_model,
      risk_score: $risk_score,
      risk_level: $risk_level,
      user_prompt: $user_prompt,
      ai_response: $ai_response,
      summary: $summary,
      security_issues: $security_issues,
      api_contract_issues: $api_contract_issues,
      checklist: $checklist
    }) {
      id
      risk_score
      created_at
    }
  }
`

// ====================================================
// 5. HELPER EXECUTION FUNCTIONS
// ====================================================

export async function executeGraphQLQuery(query: string, variables?: Record<string, any>) {
  try {
    const { data, error } = await nhost.graphql.request(query, variables)
    if (error) {
      console.warn("GraphQL Notice:", error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (err: any) {
    console.error("GraphQL execution exception:", err)
    return { data: null, error: err }
  }
}
