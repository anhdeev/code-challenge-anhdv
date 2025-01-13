FROM node:23.3.0-alpine

# Install yarn globally
RUN apk add --no-cache bash yarn

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
WORKDIR /usr/src/node-app
USER node
COPY package.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN yarn db:init
RUN yarn build

EXPOSE 3000

CMD ["node", "build/src/index.js"]