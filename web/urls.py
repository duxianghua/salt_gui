from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^aaa', views.aaa.as_view()),
]