FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm build

USER node
EXPOSE 3000
CMD [ "node", "lib/index.js" ]