FROM node:alpine AS build

WORKDIR /app

COPY . ${WORKDIR}

FROM node

WORKDIR /app

COPY --from=build /app ./

RUN echo n | npm install
RUN echo n | npm install -g --silent --save express
RUN echo n | npm install -g --silent @angular/cli

EXPOSE 4200 3000

ENTRYPOINT "./gcloud/entrypoint.sh" && /bin/bash