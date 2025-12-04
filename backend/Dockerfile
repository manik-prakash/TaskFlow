FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S backendTeam && \
    adduser -S worker -u 1001

COPY --from=builder --chown=worker:backendTeam /app /app

USER worker

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]