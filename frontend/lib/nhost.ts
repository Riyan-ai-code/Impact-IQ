import { NhostClient } from "@nhost/nhost-js"

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "local"
const region = process.env.NEXT_PUBLIC_NHOST_REGION || "us-east-1"

export const nhost = new NhostClient({
  subdomain,
  region
})

export const NHOST_GRAPHQL_URL = `https://${subdomain}.graphql.${region}.nhost.run/v1/graphql`
