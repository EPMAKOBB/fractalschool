import sys

"""Simple task generation script for Fractal School.

This example fetches task templates from Supabase and creates new tasks.
Replace placeholder logic with real generation when needed.
"""

import os
import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    sys.exit("Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables")

# Example: fetch one template
resp = requests.post(
    f"{SUPABASE_URL}/rest/v1/rpc/get_random_template",
    headers={"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"},
)

if resp.status_code != 200:
    sys.exit(f"Failed to fetch template: {resp.text}")

template = resp.json()
print("Fetched template", template)

# TODO: generate tasks based on template
