#!/usr/bin/env bash
#
executor.docker_build() {

    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_SKIP_DOCKER}\]")" ]] \
        || [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]]; then
        
        echoInfo "Skipping Docker Building..."
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
    
    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]]; then
        
        utils.tokens.replaceFromFileToFile "${ROOT_DIR}/backend/app.js" "${ROOT_DIR}/backend/app.js"
        
        echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

        # Import required lib    
        do.use gcp.gcr
        
        gcp.gcr.buildAndPublish "${GCLOUD_PROJECT_ID}" "${ROOT_DIR}/" \
                    "Dockerfile" "web-site" "--no-cache"

        echoInfo "Building and Pushing the Image to GCP"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build successfully finished on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build successfully finished on job: ${CIRCLE_JOB}"
    
    else
    
        echoInfo "Skipping Docker Building..."
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
    
    fi
}