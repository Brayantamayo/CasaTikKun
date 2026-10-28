# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev", "--", "--host", "0.0.0.0"]

FROM base AS build
RUN npm ci --include=dev
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma

# Prisma CLI (incluida en devDependencies) se requiere para aplicar las migraciones en runtime.
USER root
RUN chown -R node:node /app/node_modules/.prisma

USER node
EXPOSE 3000
CMD ["sh", "-c", "if [ \"${RUN_MIGRATIONS:-true}\" = \"true\" ]; then ./node_modules/.bin/prisma migrate deploy; fi && node dist/main"]
