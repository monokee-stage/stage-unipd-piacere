FROM node

WORKDIR /usr/src/app

COPY core/dist/ core/dist/
COPY core/package.json core/
COPY repository/dist/ repository/dist/
COPY repository/package.json repository/


RUN npm --prefix ./core install;npm --prefix ./repository install

EXPOSE 3001
# CMD cd ./core; node app.js
CMD sleep 3600
