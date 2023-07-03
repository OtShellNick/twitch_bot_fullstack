FROM node:16-alpine

WORKDIR /server/

CMD ["npm", "start"]

COPY ./package.json /server/package.json

RUN npm install

COPY . /server/