#!/usr/bin/env bash
#
executor.App_Build_Docker_Image() {
    
    local loc
    loc=$1
    
    if [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_SKIP_DOCKER}\]")" ]] \
        || [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_DESTROY}\]")" ]]; then
        
        echoInfo "Skipping Docker Building..."
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
    
    elif [[ "$(git log --format=oneline -n 1 ${CIRCLE_SHA1} | grep -E "\[${CIRCLE_COMMIT_APPLY}\]")" ]] \
        || [[ -n ${loc} ]]; then
                
        checkVars loc || echo ${DODRONES_GCP_MY_LABS_SA} > ${GCLOUD_JSON_KEY_PATH}

        # Import required lib    
        do.use gcp.gcr
        
        gcp.gcr.dockerLogin

        #gcp.gcr.buildAndPublish "${GCLOUD_PROJECT_ID}" "${ROOT_DIR}/" \
        #            "Dockerfile" "${APP_NAME}" "--build-arg \"mongo_conn_string ${MONGO_CONN_STRING}\""

        #TODO - use regex to replace special chars for dash (-) and all lower case
        # add condition when branch is master (copy from deployment step)
        docker build -t ${GCLOUD_CONTAINER_IMAGE}:${CIRCLE_BRANCH} \
            -f Dockerfile --build-arg "mongo_conn_string=${MONGO_CONN_STRING}" ${ROOT_DIR}

        docker push ${GCLOUD_CONTAINER_IMAGE}:${CIRCLE_BRANCH}

        echoInfo "Building and Pushing the Image to GCP"
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build successfully finished on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build successfully finished on job: ${CIRCLE_JOB}"
    
    else
    
        echoInfo "Skipping Docker Building..."
        integrations.telegram.sendMessage "${TELEGRAM_NOTIFICATION_ID}" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
        integrations.slack.sendMessageToChannel "bashlibs" "Docker Image Build skipped successfully on job: ${CIRCLE_JOB}"
    
    fi
}