FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes
ENV MYSQL_DATABASE=pipedrive

# Bundle app source
COPY . .
COPY ./init.sql /docker-entrypoint-initdb.d/