from django.conf.urls import url
from .netapi import views


urlpatterns = [
    url(r'^$', views.BaseView.as_view()),
    url(r'^minions$', views.Minions.as_view()),
    url(r'^minions/(?P<mid>.*)', views.Minions.as_view()),
    url(r'^jobs$', views.Jobs.as_view()),
    url(r'^jobs/(?P<jid>.*)', views.Jobs.as_view()),
    url(r'^files$', views.StateTemplate.as_view()),
    url(r'^files/(?P<fid>.*)', views.StateTemplate.as_view()),
]
