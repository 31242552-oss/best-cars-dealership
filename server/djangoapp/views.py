"""Views for authentication, dealer queries, reviews, and car inventory."""

import json
import logging
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate
from .restapis import (
    analyze_review_sentiments,
    get_request,
    post_review,
)

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    """Authenticate and log in a user with username and password."""
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("userName")
        password = data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                "userName": username,
                "status": "Authenticated"
            })
        return JsonResponse({
            "userName": username,
            "status": "Invalid credentials",
            "error": "Authentication failed"
        }, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def logout_request(request):
    """Log out current user and return empty username."""
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    """Register a new user account and log them in."""
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("userName")
        password = data.get("password")
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        email = data.get("email", "")

        username_exist = User.objects.filter(username=username).exists()
        if username_exist:
            return JsonResponse({
                "userName": username,
                "error": "Already Registered"
            }, status=400)

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )
        login(request, user)
        return JsonResponse({
            "userName": username,
            "status": "Authenticated"
        })
    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_dealerships(request, state="All"):
    """Fetch dealerships list, optionally filtered by US state."""
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = f"/fetchDealers/{state}"

    dealerships = get_request(endpoint)
    if dealerships is None:
        dealerships = []
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    """Fetch details of a single dealership by its ID."""
    endpoint = f"/fetchDealer/{dealer_id}"
    dealer = get_request(endpoint)
    if dealer is None:
        return JsonResponse({
            "status": 404,
            "message": "Dealer not found"
        }, status=404)
    return JsonResponse({"status": 200, "dealer": dealer})


def get_dealer_reviews(request, dealer_id):
    """Fetch reviews for a dealer and augment with sentiment analysis."""
    endpoint = f"/fetchReviews/dealer/{dealer_id}"
    reviews = get_request(endpoint)
    if reviews is not None:
        for review in reviews:
            rev_text = review.get("review", "")
            sentiment = analyze_review_sentiments(rev_text)
            review["sentiment"] = sentiment
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({
        "status": 500,
        "message": "Failed to fetch reviews"
    }, status=500)


@csrf_exempt
def add_review(request):
    """Post a new car dealer review."""
    if request.method == "POST":
        if not request.user.is_authenticated:
            logger.info("Anonymous user submitting review")
        data = json.loads(request.body)
        response = post_review(data)
        return JsonResponse({
            "status": 200,
            "response": response
        })
    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_cars(request):
    """Return all car makes and models."""
    count = CarMake.objects.count()
    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related("car_make").all()
    cars = []
    for car in car_models:
        cars.append({
            "id": car.id,
            "CarModel": car.name,
            "CarMake": car.car_make.name,
            "dealer_id": car.dealer_id,
            "type": car.type,
            "year": car.year,
            "mileage": car.mileage,
            "price": float(car.price)
        })
    return JsonResponse({"CarModels": cars})


def analyze_review(request, text):
    """Proxy sentiment analysis request to sentiment microservice."""
    sentiment = analyze_review_sentiments(text)
    return JsonResponse({
        "status": 200,
        "sentiment": sentiment,
        "text": text
    })
