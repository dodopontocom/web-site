FROM node:alpine

WORKDIR /app
COPY . ${WORKDIR}

EXPOSE 4200 3000

ENTRYPOINT "./gcloud/entrypoint.sh" && /bin/sh

#https://blog.mayadata.io/openebs/steps-to-deploy-angular-application-on-kubernetes