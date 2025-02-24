FROM node:20.10.0 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm i -g yarn --force

RUN yarn install

COPY . .

RUN yarn build

FROM node:20.10.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.env .env

RUN npm i -g yarn --force

RUN yarn install

EXPOSE 3007

CMD ["yarn", "start"]

# docker build -t cobuccio_api:0.0.1 -f nestjs.dockerfile .