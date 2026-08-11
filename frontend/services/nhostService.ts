import { nhost } from "@/lib/nhost"

export interface NhostProject {
  id: string
  name: string
  description: string
  repository: string
  branch: string
  team: string
  securityAnalysis: boolean
  dependencyAnalysis: boolean
  apiAnalysis: boolean
  createdAt: string
}

export interface NhostTeam {
  id: string
  name: string
  description: string
  lead: string
  createdAt: string
  members: any[]
}

// ----------------------------------------------------
// NHOST GRAPHQL QUERIES & MUTATIONS FOR PROJECTS
// ----------------------------------------------------

export const GET_PROJECTS_QUERY = `
  query GetProjects {
    projects {
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

export const CREATE_PROJECT_MUTATION = `
  mutation CreateProject($project: projects_insert_input!) {
    insert_projects_one(object: $project) {
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
    }
  }
`

// ----------------------------------------------------
// NHOST GRAPHQL QUERIES & MUTATIONS FOR TEAMS
// ----------------------------------------------------

export const GET_TEAMS_QUERY = `
  query GetTeams {
    teams {
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

export const CREATE_TEAM_MUTATION = `
  mutation CreateTeam($team: teams_insert_input!) {
    insert_teams_one(object: $team) {
      id
      name
      description
    }
  }
`

export const ADD_TEAM_MEMBER_MUTATION = `
  mutation AddTeamMember($member: team_members_insert_input!) {
    insert_team_members_one(object: $member) {
      id
      name
      email
      role
    }
  }
`

// ----------------------------------------------------
// NHOST SERVICE METHODS
// ----------------------------------------------------

export async function fetchProjectsFromNhost(): Promise<NhostProject[]> {
  try {
    const res = await nhost.graphql.request(GET_PROJECTS_QUERY)
    if (res.error) {
      console.warn("Nhost GraphQL notice:", res.error)
      return []
    }
    const data = res.data?.projects || []
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      repository: p.repository,
      branch: p.branch,
      team: p.team || "Platform Engineering",
      securityAnalysis: p.security_analysis ?? true,
      dependencyAnalysis: p.dependency_analysis ?? true,
      apiAnalysis: p.api_analysis ?? true,
      createdAt: p.created_at
    }))
  } catch (err) {
    console.warn("Error fetching projects from Nhost:", err)
    return []
  }
}

export async function createProjectInNhost(projectData: Partial<NhostProject>) {
  try {
    const res = await nhost.graphql.request(CREATE_PROJECT_MUTATION, {
      project: {
        name: projectData.name,
        description: projectData.description,
        repository: projectData.repository,
        branch: projectData.branch || "main",
        team: projectData.team || "Platform Engineering",
        security_analysis: projectData.securityAnalysis ?? true,
        dependency_analysis: projectData.dependencyAnalysis ?? true,
        api_analysis: projectData.apiAnalysis ?? true
      }
    })
    return res.data?.insert_projects_one
  } catch (err) {
    console.error("Error creating project in Nhost:", err)
    return null
  }
}

export async function fetchTeamsFromNhost(): Promise<NhostTeam[]> {
  try {
    const res = await nhost.graphql.request(GET_TEAMS_QUERY)
    if (res.error) {
      console.warn("Nhost GraphQL notice:", res.error)
      return []
    }
    const data = res.data?.teams || []
    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      lead: t.lead,
      createdAt: t.created_at,
      members: (t.team_members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        status: m.status,
        joinedAt: m.joined_at
      }))
    }))
  } catch (err) {
    console.warn("Error fetching teams from Nhost:", err)
    return []
  }
}

// Nhost Storage File Upload Helper
export async function uploadFileToNhostStorage(file: File) {
  try {
    const res = await nhost.storage.upload({ file })
    if (res.error) {
      console.error("Nhost storage error:", res.error)
      return null
    }
    return {
      fileId: res.fileMetadata?.id,
      url: nhost.storage.getPublicUrl({ fileId: res.fileMetadata?.id || "" })
    }
  } catch (err) {
    console.error("Error uploading file to Nhost storage:", err)
    return null
  }
}
