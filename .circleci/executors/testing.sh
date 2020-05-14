#!/usr/bin/env bash
#
executor.Circle_Testing() {
    echoInfo "I'm maybe running local or on CI"
    integrations.slack.sendMessageToChannel "bashlibs" "Hello from testing job: ${CIRCLE_JOB}"
}

# When script is called locally
executor.local() {
    echoWarn "You are running this script locally!"
    integrations.slack.sendMessageToChannel "bashlibs" "Script has started locally"
    #executor.App_Build_Docker_Image "local"
    executor.Circle_Testing "local" "destroy"
    executor.GCP_GKE_Provisioning "local" "destroy"
    executor.GCP_Deploy_App "local" "destroy"
}