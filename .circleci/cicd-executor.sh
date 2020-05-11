#!/usr/bin/env bash
#

ROOT_DIR="$(cd $(dirname "${BASH_SOURCE[0]}")/.. >/dev/null 2>&1 && pwd)"
source ${ROOT_DIR}/.circleci/cicd-definitions.sh

if [[ ${CI} ]]; then
    which apk && apk add --no-cache curl jq
    which apt-get && apt-get install -y curl jq
else
    export GOOGLE_APPLICATION_CREDENTIALS=${ROOT_DIR}/cloud/credentials/credential.json
fi

source ${ROOT_DIR}/dolibs.sh

function_list=($(find ${ROOT_DIR}/.circleci/executors -name "*.sh"))
for f in ${function_list[@]}; do
    source ${f}
done

# Use utils token work with tokens in file
do.use utils.tokens

# Use Telegram & Slack lib for sending after notifications
do.use integrations.telegram
do.use integrations.slack
integrations.telegram.validateToken

case ${CIRCLE_JOB} in
    ${CIRCLE_TESTING_JOB}) executor.testing;
    ;;
    ${CIRCLE_DOCKER_BUILD_JOB}) executor.docker_build;
    ;;
    ${CIRCLE_GCP_PROVISIONING_JOB}) executor.gke_provisioning;
    ;;
    ${CIRCLE_GCP_DEPLOY_APP_JOB}) executor.deploy_app;
    ;;
esac