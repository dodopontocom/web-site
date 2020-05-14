FROM node as build-stage

WORKDIR /app

COPY . /app
RUN echo n | npm install

ARG configuration=production

RUN npm run build -- --output-path=./dist/out --configuration $configuration

FROM nginx

ARG mongo_conn_string
ENV MONGO_CONN_STRING $mongo_conn_string

COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY ./cloud/bootstrap/nginx-custom.conf /etc/nginx/conf.d/default.conf
