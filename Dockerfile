FROM node:16

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install && mv node_modules ../

COPY . .

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]
