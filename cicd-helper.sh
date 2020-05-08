#!/usr/bin/env bash

which terraform && apk add --no-cache curl

source $(dirname ${BASH_SOURCE[0]})/dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/.circleci/cicd-definitions.sh

echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

# Import required lib
do.use terraform
#do.use gcp.auth
#do.use gcp.gcs
#do.use gcp.gke

# Terraform Provisioning steps
#terraform.createBackEndGCP "cloud/terraform" ${GCLOUD_PROJECT_BUCKET_NAME} "terraform"
echo ${DODRONES_GCP_MY_LABS_SA} > ${TF_VAR_key}
cd cloud/terraform
terraform init -backend-config="bucket=${TF_VAR_gcp_bucket}" -backend-config="prefix=terraform"
#terraform destroy --auto-approve
terraform.init "cloud/terraform"
terraform.apply "cloud/terraform quiet=true"

# GCP steps
#gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
#gcp.gcs.validateBucket ${GCLOUD_PROJECT_ID} ${GCLOUD_PROJECT_BUCKET_NAME}
#gcp.gke.describeCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}
#gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}