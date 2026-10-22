"""URL routing configuration for djangoapp."""

from django.urls import path
from . import views

app_name = "djangoapp"

urlpatterns = [
    # Authentication endpoints
    path("login", views.login_user, name="login"),
    path("login/", views.login_user, name="login_slash"),
    path("logout", views.logout_request, name="logout"),
    path("logout/", views.logout_request, name="logout_slash"),
    path("register", views.registration, name="register"),
    path("register/", views.registration, name="register_slash"),

    # Dealership endpoints
    path(
        "get_dealers",
        views.get_dealerships,
        name="get_dealers"
    ),
    path(
        "get_dealers/",
        views.get_dealerships,
        name="get_dealers_slash"
    ),
    path(
        "get_dealers/<str:state>",
        views.get_dealerships,
        name="get_dealers_by_state"
    ),
    path(
        "dealer/<int:dealer_id>",
        views.get_dealer_details,
        name="dealer_details"
    ),

    # Review endpoints
    path(
        "reviews/dealer/<int:dealer_id>",
        views.get_dealer_reviews,
        name="dealer_reviews"
    ),
    path("add_review", views.add_review, name="add_review"),
    path("add_review/", views.add_review, name="add_review_slash"),

    # Inventory endpoints
    path("get_cars", views.get_cars, name="get_cars"),
    path("get_cars/", views.get_cars, name="get_cars_slash"),
    path("get_carmakes", views.get_cars, name="get_carmakes"),
    path("get_carmakes/", views.get_cars, name="get_carmakes_slash"),

    # Sentiment analysis endpoint
    path(
        "analyze/<path:text>",
        views.analyze_review,
        name="analyze_review"
    ),
]
