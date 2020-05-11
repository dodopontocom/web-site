#!/usr/bin/env bash
#

ROOT_DIR="$(cd $(dirname "${BASH_SOURCE[0]}")/.. >/dev/null 2>&1 && pwd)"
source ${ROOT_DIR}/.circleci/cicd-definitions.sh

# In CI environment the Linux distribution may vary
## adding some dependencies (curl, jq)
if [[ ${CI} ]]; then
    which apk && apk add --no-cache curl jq
    which apt-get && apt-get install -y curl jq
    which yum && yum install -y curl jq
else
    export GOOGLE_APPLICATION_CREDENTIALS=${ROOT_DIR}/cloud/credentials/credential.json
fi

# Import dolibs to the execution
source ${ROOT_DIR}/dolibs.sh

# Import executor functions
function_list=($(find ${ROOT_DIR}/.circleci/executors -name "*.sh"))
for f in ${function_list[@]}; do
    source ${f}
done

# Use (globally) Common libs ##########################################
## Use utils token work with tokens in file
do.use utils.tokens

## Use Telegram & Slack lib for sending after notifications
do.use integrations.telegram
do.use integrations.slack
integrations.telegram.validateToken
############################################################

# Execute functions according to the Job names
## Set it on cicd-definitions.sh file
case ${CIRCLE_JOB} in
    ${CIRCLE_JOB_TESTING}) executor.testing;
    ;;
    ${CIRCLE_JOB_DOCKER_BUILD}) executor.docker_build;
    ;;
    ${CIRCLE_JOB_GCP_PROVISIONING}) executor.gke_provisioning;
    ;;
    ${CIRCLE_JOB_GCP_DEPLOY_APP}) executor.deploy_app;
    ;;
esac