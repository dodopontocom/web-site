#!/usr/bin/env bash
#

executor.Circle_Testing() {
    echoInfo "This is a circle testing message"
    PACKAGE_VERSION=$(cat ${ROOT_DIT}/${APP_NAME}/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    echo ${PACKAGE_VERSION}
    helper.npm_version ${CIRCLE_BRANCH} ${ROOT_DIT}/${APP_NAME}/
    PACKAGE_VERSION=$(cat ${ROOT_DIT}/${APP_NAME}/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    echo ${PACKAGE_VERSION}
    integrations.slack.sendMessageToChannel "bashlibs" "Hello from testing job: ${CIRCLE_JOB}"
}

# When script is called locally
executor.local() {
    echoWarn "You are running this script locally!"
    #integrations.slack.sendMessageToChannel "bashlibs" "Script has started locally"
    #executor.App_Build_Docker_Image "local"
    executor.Circle_Testing "local" "destroy"
    #executor.GCP_GKE_Provisioning "local" "destroy"
    #executor.GCP_Deploy_App "local" "destroy"
}