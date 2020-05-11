#!/usr/bin/env bash
#
executor.deploy_app() {

    echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}
    
    # Import required lib
    do.use gcp.auth
    do.use gcp.gke
    do.use k8s
    
    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]]; then
    
        echoInfo "Skipping this step... flag 'destroy' is set"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment was skipped on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment was skipped on job: ${CIRCLE_JOB}"

    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]]; then

        echoInfo "Deploying Application to Kubernetes Cluster"
        gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
        gcp.gke.loginCluster ${TF_VAR_cluster_name} ${TF_VAR_zone} ${GCLOUD_PROJECT_ID}

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