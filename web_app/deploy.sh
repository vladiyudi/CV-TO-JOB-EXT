cd fe
npm run build
cd ..

docker build -t gcr.io/cv-job-match/cv-to-job-app .
docker push gcr.io/cv-job-match/cv-to-job-app

export $(grep -v '^#' .env | xargs)

gcloud run deploy cv-to-job-app \
  --image gcr.io/cv-job-match/cv-to-job-app \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=$MONGODB_URI,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET,SESSION_SECRET=$SESSION_SECRET,CHROME_EXTENSION_ID=$CHROME_EXTENSION_ID,OPENAI_API_KEY=$OPENAI_API_KEY,BACKEND_URL=https://supercv.online" \
  --timeout=120s \

