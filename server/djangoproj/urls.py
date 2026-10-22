"""URL Configuration for djangoproj."""

from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),
    # Static pages
    path(
        "about/",
        TemplateView.as_view(template_name="About.html"),
        name="about"
    ),
    path(
        "about",
        TemplateView.as_view(template_name="About.html"),
        name="about_no_slash"
    ),
    path(
        "contact/",
        TemplateView.as_view(template_name="Contact.html"),
        name="contact"
    ),
    path(
        "contact",
        TemplateView.as_view(template_name="Contact.html"),
        name="contact_no_slash"
    ),
    # React App entry points
    path(
        "",
        TemplateView.as_view(template_name="index.html"),
        name="home"
    ),
    path(
        "register",
        TemplateView.as_view(template_name="index.html"),
        name="register"
    ),
    path(
        "dealers",
        TemplateView.as_view(template_name="index.html"),
        name="dealers"
    ),
    path(
        "dealer/<int:dealer_id>",
        TemplateView.as_view(template_name="index.html"),
        name="dealer"
    ),
    path(
        "postreview/<int:dealer_id>",
        TemplateView.as_view(template_name="index.html"),
        name="postreview"
    ),
    re_path(
        r"^(?:.*)/?$",
        TemplateView.as_view(template_name="index.html")
    ),
]
