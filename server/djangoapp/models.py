"""Models for CarMake and CarModel in the Best Cars dealership app."""

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class CarMake(models.Model):
    """Represents a car manufacturer/make."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")
    country = models.CharField(max_length=100, default="United States")
    founded_year = models.IntegerField(default=1900)

    def __str__(self):
        """Return the string representation of the CarMake."""
        return self.name


class CarModel(models.Model):
    """Represents a car model associated with a make and dealership."""

    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "WAGON"
    HATCHBACK = "Hatchback"

    CAR_TYPES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "WAGON"),
        (HATCHBACK, "Hatchback"),
    ]

    car_make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        related_name="models"
    )
    dealer_id = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default=SEDAN)
    year = models.IntegerField(
        default=2023,
        validators=[
            MinValueValidator(2015),
            MaxValueValidator(2023)
        ]
    )
    mileage = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        """Return the string representation of the CarModel."""
        return f"{self.car_make.name} {self.name} ({self.year})"
