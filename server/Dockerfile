FROM node:12

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

EXPOSE ${PORT}
