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

        cd ${APP_PATH}
        echo n | npm install
        npm run build -- --configuration production
        
        echo "MONGO_ATLAS_STRING=\"${MONGO_ATLAS_STRING}\"" > ${APP_PATH}/backend/.env
        echo "JWT_KEY=\"${JWT_KEY}\"" >> ${APP_PATH}/backend/.env
        echo "GCLOUD_STORAGE_BASE_URL=\"${GCLOUD_STORAGE_BASE_URL}\"" >> ${APP_PATH}/backend/.env
        echo "REF_IMOVEL_PREFIX=\"${REF_IMOVEL_PREFIX}\"" >> ${APP_PATH}/backend/.env
        echo "GCS_BUCKET=\"${GCLOUD_APP_BUCKET_NAME}\"" >> ${APP_PATH}/backend/.env
        echo "GCLOUD_PROJECT=\"${GCLOUD_PROJECT_ID}\"" >> ${APP_PATH}/backend/.env
        # echo "GCS_KEYFILE=\"/root/keys/keyfile.json\"" >> ${APP_PATH}/backend/.env

        # TODO: use credentials in production
        ### https://cloud.google.com/docs/authentication/production
        ### Google\Auth\Credentials\AppIdentityCredentials
        # credentials = google.oauth2.service_account.from_service_account_file(
        # './Peepl-cb1dac99bdc0.json',
        # scopes=['https://www.googleapis.com/auth/cloud-platform'])
        ### https://github.com/googleapis/google-auth-library-nodejs/tree/master/samples
        ### https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/storage/standard
        
        GAE_DEPLOYMENT_VERSION=""
        if [[ "${CIRCLE_BRANCH}" == "develop" ]]; then
            GAE_DEPLOYMENT_VERSION="develop-${CIRCLE_BUILD_NUM}"
        fi
        if [[ -z ${GAE_DEPLOYMENT_VERSION} ]] && [[ "${CIRCLE_BRANCH}" != "master" ]]; then
            GAE_DEPLOYMENT_VERSION="$(echo ${CIRCLE_BRANCH//\//-}-build-${CIRCLE_BUILD_NUM} | tr '[:upper:]' '[:lower:]')"
        fi
        if [[ -z ${GAE_DEPLOYMENT_VERSION} ]] && [[ "${CIRCLE_BRANCH}" == "master" ]]; then
            GAE_DEPLOYMENT_VERSION="prod-${CIRCLE_BUILD_NUM}"
        fi

        gcp.useProject "${GCLOUD_PROJECT_ID}"
        gcloud config set gcloudignore/enabled false
        cd ${APP_PATH}/backend
        gcp.gae.deploy "app.yaml" "${GAE_DEPLOYMENT_VERSION}"

        #gcp.auth.revokeSA "${GOOGLE_APPLICATION_CREDENTIALS}"
        #gcloud auth revoke "${GCLOUD_SA_EMAIL}"
        rm -vfr "${GOOGLE_APPLICATION_CREDENTIALS}"

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
