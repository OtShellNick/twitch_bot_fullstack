FROM node:16-alpine AS builder

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