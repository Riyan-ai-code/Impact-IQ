# Next.js Frontend Dockerfile
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Accept build-time arguments for Next.js static embedding
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_NHOST_SUBDOMAIN
ARG NEXT_PUBLIC_NHOST_REGION
ARG NEXT_PUBLIC_NHOST_GRAPHQL_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_NHOST_SUBDOMAIN=$NEXT_PUBLIC_NHOST_SUBDOMAIN
ENV NEXT_PUBLIC_NHOST_REGION=$NEXT_PUBLIC_NHOST_REGION
ENV NEXT_PUBLIC_NHOST_GRAPHQL_URL=$NEXT_PUBLIC_NHOST_GRAPHQL_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build

# Expose port (default 3000, overridable by PORT env)
ENV PORT=3000
EXPOSE 3000

# Start production server
CMD ["sh", "-c", "npm run start -- -p ${PORT:-3000}"]

