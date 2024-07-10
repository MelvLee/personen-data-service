#!/bin/bash

MODE=$1

if [ "$MODE" = "ci" ]; then
    docker compose -f .docker/db-ci.yml up -d
else
    docker compose -f .docker/db.yml up -d
fi

docker compose \
    -f .docker/gezag-mock.yml \
    -f .docker/gezag-proxy-mock.yml \
    -f .docker/personen-data-service.yml \
    up -d