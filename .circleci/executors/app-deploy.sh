#!/usr/bin/env bash
#
executor.GCP_Deploy_App() {

    local loc destroy
    loc=$1
    destroy=$2

    checkVars loc || echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}
    
    # Import required lib
    do.use gcp.auth
    do.use gcp.gke
    do.use k8s
    
    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]]; then
    
        echoInfo "Skipping this step... flag 'destroy' is set"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment was skipped on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment was skipped on job: ${CIRCLE_JOB}"

    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]] \
        || [[ -n ${loc} ]] && [[ -z ${destroy} ]]; then

        echoInfo "Deploying Application to Kubernetes Cluster"
        gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
        gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}

        K8S_DEPLOYMENT_TAG=""
        if [[ "${CIRCLE_BRANCH}" -eq "develop" ]]; then
            K8S_DEPLOYMENT_TAG=":${CIRCLE_BRANCH}"
        fi
        if [[ -z ${K8S_DEPLOYMENT_TAG} ]] && [[ "${CIRCLE_BRANCH}" -ne "master" ]]; then
            K8S_DEPLOYMENT_TAG=":build-${CIRCLE_BUILD_NUM}"
        fi

        utils.tokens.replaceFromFileToFile "${ROOT_DIR}/cloud/k8s/app-deployment.yaml" "${ROOT_DIR}/cloud/k8s/app-deployment.yaml"

        while read line; do
            echoInfo "${line}"
        done < ${ROOT_DIR}/cloud/k8s/app-deployment.yaml

        k8s.deployYaml "${ROOT_DIR}/cloud/k8s/app-deployment.yaml"
        k8s.deployYaml "${ROOT_DIR}/cloud/k8s/app-load-balancer-service.yaml"

        while [ "$(kubectl get services -l label-key='deployment-dev' -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')" == "" ]; do
            echoInfo "[$(date +%H:%M:%S)] - Getting External IP... [pending]"
            sleep 10
        done

        echoInfo "[$(date +%H:%M:%S)] - Getting External IP... [success]"
        echoInfo "Access the below URL to test your deployed application:"
        app_url="$(kubectl get services -l label-key='deployment-dev' -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')"
        echoInfo "http://${app_url}"

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment done on job: ${CIRCLE_JOB}"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "You can access the App here: ${app_url}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment done on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "You can access the App here: ${app_url}"
    
    else
    
        echoInfo "Skipping this step... no flag is set"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment was skipped on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment was skipped on job: ${CIRCLE_JOB}"
    
    fi
}