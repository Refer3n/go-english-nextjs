# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

FROM base AS builder
WORKDIR /app

# build-time environment variables
ENV NEXTAUTH_URL="http://172.20.0.30:3000" \
    AUTH_SECRET="TWZG8YRJ1YKMeUctaraibJEr7xZUETcXS/LNyklnYiU=" \
    NEXT_PUBLIC_API_URL="http://172.20.0.30:7168" \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID="275477223325-f1j1kovd1ngsmc4nmof3hbho1c3dt3hh.apps.googleusercontent.com"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Also set runtime ENV vars
ENV NEXTAUTH_URL="http://172.20.0.30:3000" \
    AUTH_SECRET="TWZG8YRJ1YKMeUctaraibJEr7xZUETcXS/LNyklnYiU=" \
    NEXT_PUBLIC_API_URL="http://172.20.0.30:7168" \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID="275477223325-f1j1kovd1ngsmc4nmof3hbho1c3dt3hh.apps.googleusercontent.com"

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app /app/.next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
