const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "local"
const region = process.env.NEXT_PUBLIC_NHOST_REGION || "us-east-1"

export const NHOST_GRAPHQL_URL = process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL || `https://${subdomain}.graphql.${region}.nhost.run/v1/graphql`
export const NHOST_STORAGE_URL = `https://${subdomain}.storage.${region}.nhost.run/v1`
export const NHOST_AUTH_URL = `https://${subdomain}.auth.${region}.nhost.run/v1`

// Light, resilient Nhost Client for Webpack & Next.js 15 compatibility
class NhostClientWrapper {
  subdomain: string
  region: string
  graphqlUrl: string

  constructor(subdomain: string, region: string) {
    this.subdomain = subdomain
    this.region = region
    this.graphqlUrl = NHOST_GRAPHQL_URL
  }

  graphql = {
    request: async (query: string, variables?: Record<string, any>) => {
      try {
        const res = await fetch(this.graphqlUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query, variables })
        })
        const data = await res.json()
        return { data: data.data, error: data.errors }
      } catch (err: any) {
        return { data: null, error: err }
      }
    }
  }

  storage = {
    upload: async ({ file }: { file: File }) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`${NHOST_STORAGE_URL}/files`, {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        return { fileMetadata: data, error: null }
      } catch (err: any) {
        return { fileMetadata: null, error: err }
      }
    },
    getPublicUrl: ({ fileId }: { fileId: string }) => {
      return `${NHOST_STORAGE_URL}/files/${fileId}`
    }
  }
}

export const nhost = new NhostClientWrapper(subdomain, region)
