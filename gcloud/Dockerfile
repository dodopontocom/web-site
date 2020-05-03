FROM node:alpine

WORKDIR /app
COPY . ${WORKDIR}

EXPOSE 4200 3000

ENTRYPOINT "./gcloud/entrypoint.sh" && /bin/sh