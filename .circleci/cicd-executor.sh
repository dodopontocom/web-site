#!/usr/bin/env bash
#
if [[ ${CI} ]]; then
    which apk && apk add --no-cache curl jq
    which apt-get && apt-get install -y curl jq
fi

ROOT_DIR="$(dirname ${BASH_SOURCE[0]})/.."
source ${ROOT_DIR}/dolibs.sh
source ${ROOT_DIR}/.circleci/cicd-definitions.sh

# Use Telegram lib for sending after notifications
do.use telegram
telegram.validateToken ${TELEGRAM_BOT_TOKEN}

# Execute Depending on the CircleCi Job(step)
if [[ "${CIRCLE_JOB}" == "GCP GKE Provisioning" ]]; then

    # Import required lib
    do.use terraform

    terraform_path="${ROOT_DIR}/cloud/terraform"
    echo ${DODRONES_GCP_MY_LABS_SA} > ${TF_VAR_key}

    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[tf-destroy\]")" ]]; then
        echoInfo "Terraform destroy flag detected! [Destroying GCP Resources]"
        terraform.init "${terraform_path}" "${GCLOUD_PROJECT_BUCKET_NAME}" "terraform"
        terraform destroy --auto-approve

        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Terraform destroy successfully executed on job: ${CIRCLE_JOB}"

    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[tf-apply\]")" ]]; then
        echoInfo "Terraform Apply flag detected!... [Updating GCP Resources]"
        terraform.init "${terraform_path}" "${GCLOUD_PROJECT_BUCKET_NAME}" "terraform"
        terraform.apply "${terraform_path}"

        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Terraform apply successfully executed on job: ${CIRCLE_JOB}"
    else
        echoInfo "Terraform will not be executed!"
        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Terraform was not executed on job: ${CIRCLE_JOB}"
    fi
    
fi

if [[ "${CIRCLE_JOB}" == "GCP Deploy App" ]]; then

    echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}
    
    # Import required lib
    do.use gcp.auth
    do.use gcp.gke
    do.use k8s
    
    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[tf-destroy\]")" ]]; then
        echoInfo "Skipping this step... flag 'destroy' is set"
        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Application deployment was skipped on job: ${CIRCLE_JOB}"
    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[tf-apply\]")" ]]; then

        echoInfo "Deploying Application to Kubernetes Cluster"
        gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
        gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}

        k8s.deployYaml "${ROOT_DIR}/cloud/k8s/app-deployment.yaml"
        k8s.deployYaml "${ROOT_DIR}/cloud/k8s/app-load-balancer-service.yaml"

        while [ "$(kubectl get services -l label-key='deployment-dev' -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')" == "" ]; do
            echoInfo "[$(date +%H:%M:%S)] - Getting External IP... [pending]"
            sleep 10
        done

        echoInfo "Access the below URL to test your deployed application:"
        app_url="$(kubectl get services -l label-key='deployment-dev' -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')"
        echoInfo "http://${app_url}"

        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Application deployment done on job: ${CIRCLE_JOB}"
        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "You can access the App here: ${app_url}"
    else
        echoInfo "Skipping this step... no flag is set"
        telegram.sendMessage ${TELEGRAM_BOT_TOKEN} ${TELEGRAM_NOTIFICATION_ID} \
            "Application deployment was skipped on job: ${CIRCLE_JOB}"
    fi
fi
