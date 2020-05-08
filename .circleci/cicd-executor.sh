#!/usr/bin/env bash

if [[ ${CI} ]]; then
    which apk && apk add --no-cache curl jq
fi

source $(dirname ${BASH_SOURCE[0]})/../dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/cicd-definitions.sh

# Use telegram lib
do.use telegram

# Send a message via bot
telegram.validateToken ${TELEGRAM_BOT_TOKEN}
telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} "Testing from circle ci job: ${CIRCLE_JOB}"

# Execute Depending on the CircleCi Job(step)
# if [[ "${CIRCLE_JOB}" == "GCP GKE Provisioning" ]]; then

#     terraform_path="cloud/terraform"
#     # Import required lib
#     do.use terraform

#     echo ${DODRONES_GCP_MY_LABS_SA} > ${TF_VAR_key}
    
#     cd ${terraform_path}
#     terraform init -backend-config="bucket=${TF_VAR_gcp_bucket}" -backend-config="prefix=terraform"
#     #terraform destroy --auto-approve
#     terraform.init "${terraform_path}"
#     terraform.apply "${terraform_path}"
# fi
# if [[ "${CIRCLE_JOB}" == "GCP Deploy App" ]]; then

#     echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}
    
#     # Import required lib
#     do.use gcp.auth
#     do.use gcp.gcs
#     do.use gcp.gke
    
#     gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
#     gcp.gcs.validateBucket ${GCLOUD_PROJECT_ID} ${GCLOUD_PROJECT_BUCKET_NAME}
#     gcp.gke.describeCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}
#     gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}
# fi