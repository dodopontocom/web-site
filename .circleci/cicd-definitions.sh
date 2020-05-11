#!/bin/bash
#

# APPLICATION INFO

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="xxx"
export GCLOUD_JSON_KEY_PATH="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"
export GCLOUD_PROJECT_BUCKET_NAME="terraform-gke-node"
export GCLOUD_PROJECT_REGION="us-central1"

export DOCKER_REGISTRY_SECRET_NAME="gcr-secret"
export GCLOUD_SA_NAME="devops-sa"
export GCLOUD_SA_EMAIL="${GCLOUD_SA_NAME}@${GCLOUD_PROJECT_ID}.iam.gserviceaccount.com"
export GCLOUD_CR_BUCKET="us.artifacts.${GCLOUD_PROJECT_ID}.appspot.com"

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

# Regex for commit message to trigger different job behaviors
export CIRCLE_COMMIT_APPLY="provisionar-ambiente"
export CIRCLE_COMMIT_DESTROY="destruir-ambiente"
export CIRCLE_COMMIT_SKIP_DOCKER="pular-docker"
export CIRCLE_COMMIT_QUIET="pular-cicd"
export CIRCLE_TESTING_JOB="Circle Testing"