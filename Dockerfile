# Expects the app to already have been built, e.g. by travis
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

USER node
EXPOSE 3000
CMD [ "node", "lib/index.js" ]