FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/mee42/new-website

RUN mkdir -p /main/
WORKDIR /main/
ADD package.json /main/package.json
ADD package-lock.json /main/package-lock.json
RUN npm install


COPY . /main/
RUN npx next telemetry disable

RUN npm run build

EXPOSE 3000

CMD npm run start