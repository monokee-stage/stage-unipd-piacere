FROM node

WORKDIR /usr/src/app

COPY . .


RUN npm --prefix ./core install;npm --prefix ./repository install

EXPOSE 3001

CMD cd core; node ./dist/app.js
