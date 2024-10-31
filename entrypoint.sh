#!/bin/sh

# wait until Postgres is ready
until pg_isready -h "AfterMarketProd" -p 6432 -U "awg"; do
  echo "$(date) - waiting for database to start"
  sleep 2
done

# Prisma migration
yarn prisma:migrate:dev
