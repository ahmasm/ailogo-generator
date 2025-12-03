"""
Firebase Cloud Function for AI Logo Generator
Handles job processing with mock image generation
"""

import os
import random
import time
from datetime import datetime

from firebase_functions import firestore_fn, options
from firebase_admin import initialize_app, firestore
import boto3
from botocore.config import Config

# Initialize Firebase Admin
initialize_app()

# R2 Configuration (from environment variables)
R2_ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY = os.environ.get("R2_ACCESS_KEY", "")
R2_SECRET_KEY = os.environ.get("R2_SECRET_KEY", "")
R2_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME", "ai-logo-generator")
R2_PUBLIC_URL = os.environ.get("R2_PUBLIC_URL", "")

# Mock logo URLs (pre-uploaded to R2 or public URLs)
MOCK_LOGO_URLS = [
    "https://picsum.photos/seed/logo1/512/512",
    "https://picsum.photos/seed/logo2/512/512",
    "https://picsum.photos/seed/logo3/512/512",
    "https://picsum.photos/seed/logo4/512/512",
    "https://picsum.photos/seed/logo5/512/512",
]


def get_r2_client():
    """Create and return an R2 (S3-compatible) client."""
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
        return None

    return boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        config=Config(signature_version="s3v4"),
    )


def get_mock_image_url(job_id: str) -> str:
    """
    Get a mock image URL for the job.
    If R2 is configured, upload a placeholder. Otherwise, use picsum.
    """
    r2_client = get_r2_client()

    if r2_client and R2_PUBLIC_URL:
        # TODO: Upload actual mock image to R2
        # For now, we'll use the placeholder URLs
        pass

    # Use random placeholder URL
    return random.choice(MOCK_LOGO_URLS)


@firestore_fn.on_document_created(
    document="jobs/{jobId}",
    timeout_sec=120,  # 2 minutes timeout
    memory=options.MemoryOption.MB_256,
)
def on_job_created(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    """
    Triggered when a new job document is created in Firestore.
    Simulates AI logo generation with a random delay.
    """
    job_id = event.params["jobId"]
    job_data = event.data.to_dict()

    if not job_data:
        print(f"Job {job_id}: No data found")
        return

    # Only process jobs with 'processing' status
    if job_data.get("status") != "processing":
        print(f"Job {job_id}: Skipping - status is not 'processing'")
        return

    print(f"Job {job_id}: Starting processing")
    print(f"Job {job_id}: Prompt: {job_data.get('prompt', 'N/A')}")
    print(f"Job {job_id}: Style: {job_data.get('style', 'N/A')}")

    # Random delay between 30-60 seconds
    delay = random.randint(30, 60)
    print(f"Job {job_id}: Waiting {delay} seconds...")
    time.sleep(delay)

    # Get Firestore client
    db = firestore.client()
    job_ref = db.collection("jobs").document(job_id)

    # 90% success rate, 10% failure rate
    success = random.random() < 0.9

    if success:
        # Get mock image URL
        image_url = get_mock_image_url(job_id)

        # Update job as done
        job_ref.update(
            {
                "status": "done",
                "imageUrl": image_url,
                "errorMessage": None,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )
        print(f"Job {job_id}: Completed successfully")
        print(f"Job {job_id}: Image URL: {image_url}")
    else:
        # Update job as failed
        job_ref.update(
            {
                "status": "failed",
                "imageUrl": None,
                "errorMessage": "Generation failed. Please try again.",
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )
        print(f"Job {job_id}: Failed (simulated failure)")


# Health check function (optional)
@firestore_fn.on_document_written(document="health/{docId}")
def health_check(event: firestore_fn.Event) -> None:
    """Simple health check function."""
    print("Health check: OK")
