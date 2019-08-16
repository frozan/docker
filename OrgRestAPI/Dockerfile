FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=pipedrive

RUN apt-get update -y && apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
COPY ./init.sql /docker-entrypoint-initdb.d/

CMD ["mysqld"]