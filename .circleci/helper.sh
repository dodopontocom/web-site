#!/usr/bin/env bash

source $(dirname ${BASH_SOURCE[0]})/../dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/cicd-definitions.sh

echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

# Import required lib
#do.use gcp.auth
do.use gcp.gcr

# Use the lib
#gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
echo ok
gcp.gcr.dockerLogin ${GOOGLE_APPLICATION_CREDENTIALS}