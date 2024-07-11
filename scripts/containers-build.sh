#!/bin/bash

MODE=$1

if [ "$MODE" = "ci" ]; then
    docker compose -f .docker/docker-compose-ci.yml build
else
    docker compose -f src/docker-compose.yml build
fi
