#!/bin/bash
#

# APPLICATION INFO
#export APP_NAME="$(basename -- $(which git &>/dev/null | git rev-parse --show-toplevel | sed "s#/\|_\|\.#-#g" | tr '[:upper:]' '[:lower:]'))"
export APP_NAME="web-site"
export BACKEND_URL="http://35.193.137.237/api/v1"

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="continual-voice-276914"
export GCLOUD_JSON_KEY_PATH="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"
export GCLOUD_PROJECT_BUCKET_NAME="tf-bkend"
export GCLOUD_PROJECT_REGION="us-central1"

export DOCKER_REGISTRY_SECRET_NAME="gcr-secret"
export GCLOUD_SA_NAME="devops-sa"
export GCLOUD_SA_EMAIL="${GCLOUD_SA_NAME}@${GCLOUD_PROJECT_ID}.iam.gserviceaccount.com"
export GCLOUD_CONTAINER_REGISTRY_BUCKET="us.artifacts.${GCLOUD_PROJECT_ID}.appspot.com"
export GCLOUD_CONTAINER_IMAGE="us.gcr.io/${GCLOUD_PROJECT_ID}/${APP_NAME}"

# Terraform variables
export TF_VAR_gcp_bucket="${GCLOUD_PROJECT_BUCKET_NAME}"
export TF_VAR_project_id="${GCLOUD_PROJECT_ID}"
export TF_VAR_machine_type="n1-standard-4"
export TF_VAR_region="${GCLOUD_PROJECT_REGION}"
export TF_VAR_zone="${GCLOUD_PROJECT_REGION}-a"
export TF_VAR_cluster_name="gke-cluster-1"
export TF_VAR_cluster_count="3"
export TF_VAR_key="${GCLOUD_JSON_KEY_PATH}"

export GOOGLE_APPLICATION_CREDENTIALS=${TF_VAR_key}

# Circle ci references
export CIRCLE_COMMIT_APPLY="tf-apply"
export CIRCLE_COMMIT_TF_DRY_RUN="tf-plan"
export CIRCLE_COMMIT_DESTROY="tf-destroy"
export CIRCLE_COMMIT_SKIP_DOCKER="skip-docker"
