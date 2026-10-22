"""Django admin configuration for CarMake and CarModel."""

from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    """Inline view for CarModel inside CarMake admin page."""

    model = CarModel
    extra = 1


class CarMakeAdmin(admin.ModelAdmin):
    """Admin configuration for CarMake."""

    list_display = ("name", "country", "founded_year", "description")
    search_fields = ("name", "country")
    inlines = [CarModelInline]


class CarModelAdmin(admin.ModelAdmin):
    """Admin configuration for CarModel."""

    list_display = (
        "name",
        "car_make",
        "dealer_id",
        "type",
        "year",
        "mileage",
        "price"
    )
    list_filter = ("car_make", "type", "year", "dealer_id")
    search_fields = ("name", "car_make__name")


admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
