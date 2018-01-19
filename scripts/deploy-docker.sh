#!/usr/bin/env sh

# This script requires the environment variables $DOCKER_USERNAME and $DOCKER_SECRET

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_SECRET"
docker build -t 4temps .
docker tag 4temps:latest ${DOCKER_USERNAME}/4temps:latest
docker push ${DOCKER_USERNAME}/4temps:latest