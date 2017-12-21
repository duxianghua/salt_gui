from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^state$', views.file),
    url(r'^jobs$', views.jobs),
]