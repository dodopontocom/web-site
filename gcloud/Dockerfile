FROM node:alpine

WORKDIR /app
COPY . ${WORKDIR}

RUN echo n | npm install
RUN echo n | npm install -g --silent --save express
RUN echo n | npm install -g --silent @angular/cli

EXPOSE 4200 3000

ENTRYPOINT "./gcloud/entrypoint.sh" && /bin/sh