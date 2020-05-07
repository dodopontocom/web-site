#!/usr/bin/env bash

# This line of code will source the dolibs entrypoint, this format help to find dolibs.sh 
# file relative to the current script path, regardesless of where it was executed
source $(dirname ${BASH_SOURCE[0]})/dolibs.sh
source $(dirname ${BASH_SOURCE[0]})/.circleci/cicd-definitions.sh

# Import required lib
do.use gcp.auth

# Use the lib
gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}