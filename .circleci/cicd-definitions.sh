#!/bin/bash
#

# APPLICATION INFO
export APP_NAME="web-site"
export STARTUP_SCRIPT="init-app.sh"

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="pa-igti"
export GCLOUD_JSON_KEY_PATH="${CIRCLE_WORKING_DIRECTORY}/cloud/credentials/credential.json"
export GCLOUD_PROJECT_BUCKET_NAME="terraform-backend-bucket"
export GCLOUD_PROJECT_REGION="us-central1"

export DOCKER_REGISTRY_SECRET_NAME="gcr-secret"
export GCLOUD_SA_NAME="devops-sa"
export GCLOUD_SA_EMAIL="${GCLOUD_SA_NAME}@${GCLOUD_PROJECT_ID}.iam.gserviceaccount.com"
export GCLOUD_CONTAINER_REGISTRY_BUCKET="us.artifacts.${GCLOUD_PROJECT_ID}.appspot.com"
export GCLOUD_CONTAINER_IMAGE="us.gcr.io/${GCLOUD_PROJECT_ID}/${APP_NAME}"

# Terraform variables
export TF_VAR_tf_backend_bucket_name="${GCLOUD_PROJECT_BUCKET_NAME}"
export TF_VAR_project_id="${GCLOUD_PROJECT_ID}"
export TF_VAR_machine_type="n1-standard-4"
export TF_VAR_region="${GCLOUD_PROJECT_REGION}"
export TF_VAR_zone="${GCLOUD_PROJECT_REGION}-a"
export TF_VAR_cluster_name="gke-cluster-1"
export TF_VAR_cluster_count="3"
export TF_VAR_key="${GCLOUD_JSON_KEY_PATH}"
export TF_VAR_vpc_name="${GCLOUD_PROJECT_ID}-vpc"

export TF_VAR_compute_instance_environment="dev"
export TF_VAR_ubuntu_image="ubuntu-os-cloud/ubuntu-1804-lts"
export TF_VAR_startup_script="${CIRCLE_WORKING_DIRECTORY}/cloud/scripts/${STARTUP_SCRIPT}"
export TF_VAR_ssd_name="data-ssd"

export TF_VAR_MONGO_ATLAS_STRING="${MONGO_ATLAS_STRING}"
export TF_VAR_JWT_KEY="${JWT_KEY}"

export GOOGLE_APPLICATION_CREDENTIALS=${TF_VAR_key}

# Circle ci references
export CIRCLE_COMMIT_APPLY="tf-apply"
export CIRCLE_COMMIT_TF_DRY_RUN="tf-plan"
export CIRCLE_COMMIT_DESTROY="tf-destroy"
export CIRCLE_COMMIT_SKIP_DOCKER="skip-docker"

# AZURE ENV VARS
export ARM_SUBSCRIPTION_ID="00201a7b-5583-44e1-a52a-a4e35224fc37"
#azure app az-terraform
#export ARM_CLIENT_ID="badf26f9-1610-46da-9947-d2d37680f56a"
#azure devops msi
export ARM_CLIENT_ID="e48e114e-6e70-4ec9-b163-23372d022b73"
export ARM_CLIENT_SECRET="_fN1hJv_M0m-Vx4kD-f1pdkZ8N-oP~aS00"
export ARM_TENANT_ID="0d5e9566-201e-4e28-a1d7-8932024d8305"

export TF_VAR_subscription_id="${ARM_SUBSCRIPTION_ID}"
export TF_VAR_client_id="${ARM_CLIENT_ID}"
export TF_VAR_client_secret="${ARM_CLIENT_SECRET}"
export TF_VAR_tenant_id="${ARM_TENANT_ID}"

