docker build --platform linux/amd64 -t gcr.io/cv-job-match/job-cv-matcher .

docker push gcr.io/cv-job-match/job-cv-matcher

gcloud run deploy cv-job-backend \
  --image gcr.io/cv-job-match/job-cv-matcher \
  --region=me-west1 \
  --allow-unauthenticated


CHECKING LOGS
Identify Your Service:

First, list all your Cloud Run services to identify the one you want to check logs for:
bash
Copy code
gcloud run services list
View Logs:

Use the following command to view the logs for your specific service:

bash
Copy code
gcloud logs read --project=cv-job-match --service=your-service-name
Replace your-service-name with the name of your service.

You can add the --limit flag to see a specific number of log entries:

bash
Copy code
gcloud logs read --project=cv-job-match --service=your-service-name --limit=50
To see logs for a specific revision (e.g., a particular deployment), use:

bash
Copy code
gcloud logs read --project=cv-job-match --service=your-service-name --revision=your-revision-name
Filter Logs:

You can filter logs by severity (e.g., errors) using the --severity flag:
bash
Copy code
gcloud logs read --project=cv-job-match --service=your-service-name --severity=ERROR
