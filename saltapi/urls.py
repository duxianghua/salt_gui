from django.conf.urls import url
from .netapi import views


urlpatterns = [
    url(r'^$', views.BaseView.as_view()),
    #url(r'^test', views.TestView.as_view()),
]
