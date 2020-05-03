#!/usr/bin/env bash

MODULES_PATH=../node_modules
bkp_run=/tmp/building-docker/

mkdir ${bkp_run}

mv ../node_modules ../.node_modules
cp -rv ../* ${bkp_run}
cp ${bkp_run}/gcloud/Dockerfile ${bkp_run}
mv ../.node_modules ../node_modules

cd ${bkp_run}

docker build -t web-site .

rm -vfr ${bkp_run}