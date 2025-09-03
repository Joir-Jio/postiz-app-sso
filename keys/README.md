# Keys Directory

This directory is for storing service account keys and certificates.

## Setup

1. Place your GCS service account JSON file here
2. Rename it to `shared-gcs-service-account.json` 
3. Make sure it matches the path in your .env file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS="./keys/shared-gcs-service-account.json"
   ```

## Security

- Never commit actual keys to git
- The .gitignore file excludes *.json files in this directory
- Only this README.md file should be committed
