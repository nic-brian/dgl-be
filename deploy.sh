#! /bin/bash

gcloud functions deploy dgl-be \
  --gen2 \
  --runtime=nodejs18 \
  --region=us-west1 \
  --source=. \
  --entry-point=dgl_be \
  --trigger-http \
  --allow-unauthenticated \
  --update-env-vars \
DB_HOST=$DB_HOST,\
DB_USER=$DB_USER,\
DB_PASS=$DB_PASS,\
DB_NAME=$DB_NAME,\
FRONTEND_URL=$FRONTEND_URL,\
GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT,\
RECAPTCHA_SECRET=$RECAPTCHA_SECRET,\
SMTP_HOST=$SMTP_HOST,\
SMTP_PASS=$SMTP_PASS,\
SMTP_USER=$SMTP_USER

