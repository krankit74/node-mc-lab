# Stage 1: build deps
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: slim runtime
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app .
EXPOSE 3000
CMD ["npm","start"]