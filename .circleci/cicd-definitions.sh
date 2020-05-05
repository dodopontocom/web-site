#!/bin/bash
#

# APPLICATION INFO
export APP_NAME="web-site"

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="terraform-gcp-lab"
export GCLOUD_JSON_KEY_PATH="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"
export GCLOUD_PROJECT_BUCKET_NAME="terraform-gke-node"
export GCLOUD_PROJECT_REGION="us-central1"

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

# Telegram notification via bot
export NOTIFICATION_IDS="11504381"
