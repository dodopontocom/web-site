#!/usr/bin/env bash
#
executor.GAE_Deploy_App() {

    local loc destroy
    loc=$1
    destroy=$2

    checkVars loc || echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}
    
    # Import required lib
    do.use gcp
    do.use gcp.auth
    do.use gcp.gae
    do.use gcp.gcs
    
    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_GAE}\]")" ]] \
        || [[ -n ${loc} ]] && [[ -z ${destroy} ]]; then

        echoInfo "Deploying Application in Google App Engine"
        gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}

        
        APP_PATH="${CIRCLE_WORKING_DIRECTORY}/construtora-cp"

        echo "MONGO_ATLAS_STRING=\"${MONGO_ATLAS_STRING}\"" > ${APP_PATH}/.env
        echo "JWT_KEY=\"${JWT_KEY}\"" >> ${APP_PATH}/.env

        cd ${APP_PATH}
        echo n | npm install
        npm run build -- --configuration production
        ls -lrta ${APP_PATH}/backend/angular
        
        GAE_DEPLOYMENT_VERSION=""
        if [[ "${CIRCLE_BRANCH}" -eq "develop" ]]; then
            GAE_DEPLOYMENT_VERSION="develop-${CIRCLE_BUILD_NUM}"
        fi
        if [[ -z ${K8S_DEPLOYMENT_TAG} ]] && [[ "${CIRCLE_BRANCH}" -ne "master" ]]; then
            GAE_DEPLOYMENT_VERSION="build-${CIRCLE_BUILD_NUM}"
        fi
        #if [[ -z ${K8S_DEPLOYMENT_TAG} ]] && [[ "${CIRCLE_BRANCH}" -eq "master" ]]; then
        #    GAE_DEPLOYMENT_VERSION="prod-${CIRCLE_BUILD_NUM}"
        #fi

        gcp.useProject "${GCLOUD_PROJECT_ID}"
        gcloud config set gcloudignore/enabled false
        gcp.gae.deploy "${APP_PATH}/backend/app.yaml" "${GAE_DEPLOYMENT_VERSION}"

        message=$(gcloud app browse --no-launch-browser -s backend -v ${GAE_DEPLOYMENT_VERSION})

        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment done on job: ${CIRCLE_JOB}"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "You can access the App here: ${message}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment done on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "You can access the App here: ${app_url}"
    
    else
    
        echoInfo "Skipping this step... no flag is set"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Application deployment was skipped on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Application deployment was skipped on job: ${CIRCLE_JOB}"
    
    fi
}
