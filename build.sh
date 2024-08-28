#!/usr/bin/env bash

# Set -E to stop if any command other than conditional command fails to execute
set -e

# Name of the docker image
IMAGE=$1;

if [[ -z "$1" ]]; then
#    echo -e "\nPlease call '$0 <image>' to deploy this image!\n"
#    exit 1
     IMAGE="aqt/software"
fi

# type of the image
DOCKER_FILE="Dockerfile"


if [[ "alpine" == "$2" ]]; then
    DOCKER_FILE="Dockerfile-alpine"
fi

docker build \
    --build-arg SSH_PRIVATE_KEY="$(cat $HOME/.ssh/id_rsa)" \
    --build-arg SSH_PUBLIC_KEY="$(cat $HOME/.ssh/id_rsa.pub)" \
    -t \
    $IMAGE \
    -f ${DOCKER_FILE} .

