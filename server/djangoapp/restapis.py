"""REST API client functions for communicating with backend microservices."""

import os
import urllib.parse
from dotenv import load_dotenv
import requests

load_dotenv()

backend_url = os.getenv("BACKEND_URL", "http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    "SENTIMENT_ANALYZER_URL",
    "http://localhost:5050"
)


def get_request(endpoint, **kwargs):
    """Send a GET request to the Node backend service."""
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    request_url = backend_url + endpoint
    if params:
        request_url = request_url + "?" + params.rstrip("&")

    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except requests.exceptions.RequestException as err:
        print(f"Network exception occurred: {err}")
        return None


def analyze_review_sentiments(text):
    """Send text to the sentiment analyzer microservice.

    Returns positive, negative, or neutral.
    """
    if not text:
        return "neutral"

    encoded_text = urllib.parse.quote(text)
    request_url = f"{sentiment_analyzer_url}/analyze/{encoded_text}"
    print(f"Analyzing sentiment at: {request_url}")

    try:
        response = requests.get(request_url, timeout=5)
        data = response.json()
        return data.get("sentiment", "neutral")
    except requests.exceptions.RequestException as err:
        print(f"Sentiment service exception: {err}")
        return "neutral"


def post_review(data_dict):
    """Send a POST request with review data to the Node backend."""
    request_url = backend_url + "/insert_review"
    print(f"POST to {request_url} with data: {data_dict}")

    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        return response.json()
    except requests.exceptions.RequestException as err:
        print(f"Failed to post review: {err}")
        return None
