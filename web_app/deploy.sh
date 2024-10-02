export $(grep -v '^#' .env | xargs)

gcloud run deploy cv-to-job-app \
  --image gcr.io/cv-job-match/cv-to-job-app \
  --platform managed \
  --region me-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=$MONGODB_URI,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET,SESSION_SECRET=$SESSION_SECRET,CHROME_EXTENSION_ID=$CHROME_EXTENSION_ID,OPENAI_API_KEY=$OPENAI_API_KEY,BACKEND_URL=https://cv-to-job-app-47779369171.me-central1.run.app" \
  --timeout=120s \
  --verbosity=debug
