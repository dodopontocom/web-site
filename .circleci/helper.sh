#!/usr/bin/env bash

source $(dirname ${BASH_SOURCE[0]})/../dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/cicd-definitions.sh

echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

# Import required lib
do.use gcp.auth
#do.use gcp.gcr
do.use gcp.gcs

# Use the lib
gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
gcp.gcs.validateBucket ${GCLOUD_PROJECT_ID} ${GCLOUD_PROJECT_BUCKET_NAME} 
#gcp.gcr.dockerLogin ${GOOGLE_APPLICATION_CREDENTIALS}