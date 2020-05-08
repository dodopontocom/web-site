#!/usr/bin/env bash

source $(dirname ${BASH_SOURCE[0]})/../dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/cicd-definitions.sh

echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

# Import required lib
do.use gcp.auth
do.use gcp.gcs
do.use gcp.gke

# Use the lib
gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
gcp.gcs.validateBucket ${GCLOUD_PROJECT_ID} ${GCLOUD_PROJECT_BUCKET_NAME}
gcp.gke.describeCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}
gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}