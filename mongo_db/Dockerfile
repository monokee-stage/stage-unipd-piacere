FROM mongo:latest

WORKDIR /usr/src/app

COPY . .

COPY setup.js /docker-entrypoint-initdb.d

EXPOSE 27017