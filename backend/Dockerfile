FROM node:9.8.0-alpine

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]