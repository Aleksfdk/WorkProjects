FROM node:16.13.2-bullseye as build
WORKDIR /app/
COPY . .
RUN npm install --no-audit --no-fund --legacy-peer-deps
RUN npm run lint
RUN npm run build

FROM nginx:stable as runtime
COPY --from=build /app/build/ /var/www/
