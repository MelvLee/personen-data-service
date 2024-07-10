#!/bin/bash

MODE=$1

if [ "$MODE" = "ci" ]; then
    docker buildx create --name container --driver docker-container --use
    docker compose -f .docker/docker-compose-ci.yml build
    docker buildx rm --force container
else
    docker compose -f src/docker-compose.yml build
fi
