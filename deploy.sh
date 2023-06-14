#! /bin/bash

gcloud functions deploy tstest5 \
  --gen2 \
  --runtime=nodejs18 \
  --region=us-west1 \
  --source=. \
  --entry-point=hello \
  --trigger-http \
  --allow-unauthenticated
