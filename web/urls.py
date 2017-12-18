from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index.as_view()),
    url(r'^minions/(?P<mid>\w+)', views.minions.as_view()),
]