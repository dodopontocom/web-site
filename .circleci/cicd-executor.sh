#!/usr/bin/env bash
#

ROOT_DIR="$(cd $(dirname "${BASH_SOURCE[0]}")/.. >/dev/null 2>&1 && pwd)"
source ${ROOT_DIR}/.circleci/cicd-definitions.sh
source ${ROOT_DIR}/.circleci/helper/helpers.sh

# In CI environment the Linux distribution may vary
## adding some dependencies (curl, jq)
if [[ ${CI} ]]; then
    which apk && apk add --no-cache curl jq nodejs npm
    which apt-get && apt-get install -y curl jq nodejs npm
    which yum && yum install -y curl jq nodejs npm
else
    CIRCLE_JOB="local"
    export GOOGLE_APPLICATION_CREDENTIALS=${ROOT_DIR}/cloud/credentials/credential.json
fi

# Import dolibs to the execution
source ${ROOT_DIR}/dolibs.sh

checkVars APP_NAME || exitOnError ${?}

# Use (globally) Common libs
## Use utils token work with tokens in file
do.use utils.tokens

# Import executor functions
function_list=($(find ${ROOT_DIR}/.circleci/executors -name "*.sh"))
for f in ${function_list[@]}; do
    source ${f}
done

# Execute functions according to the Job names
case ${CIRCLE_JOB} in
    ${CIRCLE_JOB})
        do.use integrations.telegram
        do.use integrations.slack
        
        integrations.telegram.validateToken
        executor.${CIRCLE_JOB}
    ;;
esac