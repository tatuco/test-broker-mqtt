FROM node:14

RUN mkdir -p app

RUN npm install --global nodemon
RUN npm install --global pm2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./app






