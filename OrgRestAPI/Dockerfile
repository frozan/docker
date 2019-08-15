FROM debian:stretch-slim

RUN apt-get update -y && apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js"]