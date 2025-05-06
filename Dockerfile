FROM node:16.13.1-alpine3.13 AS deps

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

FROM node:16.13.1-alpine3.13

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -S nodejs -g 1001
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs .

COPY --chown=nextjs:nodejs --from=deps /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

USER nextjs

RUN npm run generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
