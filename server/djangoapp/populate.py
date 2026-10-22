"""Seed database with initial CarMake and CarModel instances."""

from .models import CarMake, CarModel


def initiate():
    """Populate initial car makes and models."""
    car_make_data = [
        {
            "name": "Toyota",
            "description": "Japanese multinational automotive manufacturer",
            "country": "Japan",
            "founded_year": 1937,
        },
        {
            "name": "Honda",
            "description": (
                "Japanese automotive and power equipment manufacturer"
            ),
            "country": "Japan",
            "founded_year": 1948,
        },
        {
            "name": "Ford",
            "description": "American multinational automobile manufacturer",
            "country": "United States",
            "founded_year": 1903,
        },
        {
            "name": "Audi",
            "description": "German automotive manufacturer of luxury vehicles",
            "country": "Germany",
            "founded_year": 1909,
        },
        {
            "name": "Chevrolet",
            "description": "American automobile division of General Motors",
            "country": "United States",
            "founded_year": 1911,
        },
    ]

    car_makes = {}
    for data in car_make_data:
        make, _ = CarMake.objects.get_or_create(
            name=data["name"],
            defaults={
                "description": data["description"],
                "country": data["country"],
                "founded_year": data["founded_year"],
            },
        )
        car_makes[data["name"]] = make

    car_model_data = [
        # Toyota
        {
            "name": "Camry",
            "make": "Toyota",
            "type": "Sedan",
            "year": 2021,
            "dealer_id": 1,
            "mileage": 18500,
            "price": 24500.00,
        },
        {
            "name": "RAV4",
            "make": "Toyota",
            "type": "SUV",
            "year": 2022,
            "dealer_id": 1,
            "mileage": 12000,
            "price": 28900.00,
        },
        {
            "name": "Corolla",
            "make": "Toyota",
            "type": "Sedan",
            "year": 2020,
            "dealer_id": 2,
            "mileage": 31000,
            "price": 19800.00,
        },
        {
            "name": "Highlander",
            "make": "Toyota",
            "type": "SUV",
            "year": 2023,
            "dealer_id": 3,
            "mileage": 5400,
            "price": 39500.00,
        },
        # Honda
        {
            "name": "Civic",
            "make": "Honda",
            "type": "Sedan",
            "year": 2021,
            "dealer_id": 1,
            "mileage": 22000,
            "price": 22900.00,
        },
        {
            "name": "CR-V",
            "make": "Honda",
            "type": "SUV",
            "year": 2022,
            "dealer_id": 2,
            "mileage": 14500,
            "price": 29400.00,
        },
        {
            "name": "Accord",
            "make": "Honda",
            "type": "Sedan",
            "year": 2023,
            "dealer_id": 4,
            "mileage": 7000,
            "price": 27800.00,
        },
        # Ford
        {
            "name": "Mustang",
            "make": "Ford",
            "type": "Sedan",
            "year": 2022,
            "dealer_id": 5,
            "mileage": 9500,
            "price": 33200.00,
        },
        {
            "name": "Explorer",
            "make": "Ford",
            "type": "SUV",
            "year": 2021,
            "dealer_id": 6,
            "mileage": 27000,
            "price": 34800.00,
        },
        {
            "name": "Escape",
            "make": "Ford",
            "type": "SUV",
            "year": 2020,
            "dealer_id": 3,
            "mileage": 35000,
            "price": 22500.00,
        },
        # Audi
        {
            "name": "A4",
            "make": "Audi",
            "type": "Sedan",
            "year": 2022,
            "dealer_id": 2,
            "mileage": 16000,
            "price": 41500.00,
        },
        {
            "name": "Q5",
            "make": "Audi",
            "type": "SUV",
            "year": 2023,
            "dealer_id": 5,
            "mileage": 8200,
            "price": 47200.00,
        },
        {
            "name": "A6",
            "make": "Audi",
            "type": "Sedan",
            "year": 2021,
            "dealer_id": 7,
            "mileage": 24000,
            "price": 53900.00,
        },
        # Chevrolet
        {
            "name": "Malibu",
            "make": "Chevrolet",
            "type": "Sedan",
            "year": 2021,
            "dealer_id": 4,
            "mileage": 29000,
            "price": 21800.00,
        },
        {
            "name": "Tahoe",
            "make": "Chevrolet",
            "type": "SUV",
            "year": 2023,
            "dealer_id": 1,
            "mileage": 6100,
            "price": 56000.00,
        },
        {
            "name": "Equinox",
            "make": "Chevrolet",
            "type": "SUV",
            "year": 2020,
            "dealer_id": 6,
            "mileage": 33000,
            "price": 23500.00,
        },
    ]

    for model_info in car_model_data:
        make_obj = car_makes[model_info["make"]]
        CarModel.objects.get_or_create(
            name=model_info["name"],
            car_make=make_obj,
            year=model_info["year"],
            defaults={
                "type": model_info["type"],
                "dealer_id": model_info["dealer_id"],
                "mileage": model_info["mileage"],
                "price": model_info["price"],
            },
        )
