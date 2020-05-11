#!/usr/bin/env bash
#
executor.gke_provisioning() {

    # Import required lib
    do.use terraform

    terraform_path="${ROOT_DIR}/cloud/terraform"
    echo ${DODRONES_GCP_MY_LABS_SA} > ${TF_VAR_key}

    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]]; then
    
        echoInfo "Terraform destroy flag detected! [Destroying GCP Resources]"
        terraform.init_gcp "${terraform_path}" "${GCLOUD_PROJECT_BUCKET_NAME}" "terraform"
        terraform destroy --auto-approve

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform destroy successfully executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform destroy successfully executed on job: ${CIRCLE_JOB}"

    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]]; then
    
        echoInfo "Terraform Apply flag detected!... [Updating GCP Resources]"
        terraform.init_gcp "${terraform_path}" "${GCLOUD_PROJECT_BUCKET_NAME}" "terraform"
        terraform.apply "${terraform_path}"

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
    
    else
    
        echoInfo "Terraform will not be executed!"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform was not executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform was not executed on job: ${CIRCLE_JOB}"
    
    fi
}