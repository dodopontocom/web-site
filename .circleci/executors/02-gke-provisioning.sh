#!/usr/bin/env bash
#
executor.GCP_GKE_Provisioning() {

    local loc destroy
    loc=$1
    destroy=$2

    # Import required lib
    do.use terraform

    terraform_path="${ROOT_DIR}/cloud/terraform-k8s"
    TF_VAR_key=${GOOGLE_APPLICATION_CREDENTIALS}
    checkVars loc || echo ${DODRONES_GCP_MY_LABS_SA} > ${TF_VAR_key}

    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]] \
        || [[ -n ${destroy} ]]; then
    
        echoInfo "Terraform destroy flag detected! [Destroying GCP Resources]"
        terraform.init_gcp "${terraform_path}" "${GCLOUD_TF_BUCKET_NAME}" "terraform"
        terraform destroy --auto-approve

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform destroy successfully executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform destroy successfully executed on job: ${CIRCLE_JOB}"

    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]] \
        || [[ -n ${loc} ]]; then
    
        echoInfo "Terraform Apply flag detected!... [Updating GCP Resources]"
        terraform.init_gcp "${terraform_path}" "${GCLOUD_TF_BUCKET_NAME}" "terraform"
        terraform.apply "${terraform_path}"

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_TF_DRY_RUN}\]")" ]]; then
        
        echoInfo "Terraform Plan flag detected!... [Executing dry-run mode]"
        terraform.init_gcp "${terraform_path}" "${GCLOUD_TF_BUCKET_NAME}" "terraform"
        cd "${terraform_path}"
        terraform plan

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
    else
    
        echoInfo "Terraform will not be executed!"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Terraform was not executed on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Terraform was not executed on job: ${CIRCLE_JOB}"
    
    fi

    rm -vfr "${GOOGLE_APPLICATION_CREDENTIALS}"
    
}