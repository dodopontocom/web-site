#!/bin/bash

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="terraform-gcp-lab"
export GCLOUD_JSON_KEY_PATH="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"
export GCLOUD_PROJECT_BUCKET_NAME="gke-auto"
export GCLOUD_PROJECT_REGION="us-central1"

# Terraform variables
export TF_VAR_gcp_bucket="${GCLOUD_PROJECT_BUCKET_NAME}"
export TF_VAR_project_id="${GCLOUD_PROJECT_ID}"
export TF_VAR_machine_type="n1-standard-4"
export TF_VAR_region="${GCLOUD_PROJECT_REGION}"
export TF_VAR_zone="us-central1-a"
export TF_VAR_node_pool="gke-node-1"
export TF_VAR_key="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"

export GOOGLE_APPLICATION_CREDENTIALS=${TF_VAR_key}