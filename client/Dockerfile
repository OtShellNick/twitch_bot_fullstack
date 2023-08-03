FROM node:16-alpine AS builder

ARG CLIENT_ID
ARG SECRET_KEY
ARG REDIRECT_URI
ARG SERVER_URI
ARG SOCKET_URI
ARG MONGO_USERNAME
ARG MONGO_PASSWORD
ARG MONGO_CONNECT_URI
ARG MONGO_PORT
ARG SERVER_PORT
ARG TOKEN_SECRET
ARG BOT_ACCOUNT
ARG REFRESH_TOKEN
ARG LOGIN

WORKDIR /client/

COPY ./package.json /client/package.json

RUN npm install --legacy-peer-deps

COPY . /client/

RUN npm run prod

FROM nginx:1.19-alpine AS server
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
