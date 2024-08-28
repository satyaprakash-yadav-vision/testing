#!/bin/bash

# Set -E to stop if any command other than conditional command fails to execute
set -e

if [[ -z "$1" ]]; then
    echo -e "\nPlease call '$0 <version>' to deploy this image!\n"
    exit 1
fi

# Name of the docker image
IMAGE=aqt

# Name of the docker container
CONTAINER=api.aqt

# Path to the script containing the run command
RUN_FILE_PATH="$HOME/containers/api.aqt.sh"

# Number of previous versions to keep
NUM_VERSIONS_TO_KEEP=5

# pull latest code
git fetch --all --tags && git pull

# Run build script
bash build.sh $IMAGE

# remove old docker container
docker rm -f ${CONTAINER} 2>&1 | cat

# Start the container from the latest image
# We run from the latest image because the run script refers to the latest image
# Once it executes, we tag the latest image with the passed version
eval "${RUN_FILE_PATH}"

# Remove the docker image that has the passed version tag
docker rmi ${IMAGE}:$1 2>&1 | cat

# Now tag the image with the latest tag with the given version
docker tag ${IMAGE}:latest ${IMAGE}:$1 | echo "Image tagged ${IMAGE}:$1"

# Get all the different tags for the same image
ALL_IMAGES=$(docker images ${IMAGE} -q)

# using the more stable code
# from https://stackoverflow.com/questions/11426529/reading-output-of-a-command-into-an-array-in-bash

NUM_DELETED=0;
while IFS= read -r IMAGE_ID; do
    if (( NUM_DELETED > ${NUM_VERSIONS_TO_KEEP} )); then
     echo Deleting image : ${IMAGE_ID};
     docker rmi ${IMAGE_ID};
    fi
    NUM_DELETED=$((NUM_DELETED+1));
done < <(docker images ${IMAGE} -q);
