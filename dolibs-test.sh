#!/usr/bin/env bash

# This line of code will source the dolibs entrypoint, this format help to find dolibs.sh 
# file relative to the current script path, regardesless of where it was executed
source $(dirname ${BASH_SOURCE[0]})/dolibs.sh

# Import required lib
do.use gcp

# Use the lib
# gcp.useSA ${GOOGLE_APPLICATION_CREDENTIALS}
gcp.setDefaultZone