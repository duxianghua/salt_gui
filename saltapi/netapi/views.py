# sys lib imports
from functools import wraps
import logging
import json


# rest framework imports
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

import salt.config

import saltapi

class BaseView(APIView):
    def __init__(self):
        super(BaseView, self).__init__()
        self.opts = salt.config.master_config('/etc/salt/master')
        self.api = saltapi.APIClient(self.opts)

    #authentication_classes = (SessionAuthentication, BasicAuthentication, TokenAuthentication)
    #permission_classes = (IsAdminUser,)
    http_method_names = ['get', 'post']

    def check_client_permissions(self, request, *args, **kwargs):
        pass

    def check_modules_permissions(self, request, *args, **kwargs):
        pass

    def exec_lowstate(self, lowstate):
        print lowstate
        return self.api.run(lowstate)
        #return {'status': 'ok'}


    def get(self, request, *args, **kwargs):
        import inspect
        clients = [name for name, _ in inspect.getmembers(saltapi.APIClient,
                                                          predicate=inspect.ismethod) if not name.startswith('__')]
        clients.remove('run')
        ret = {
            'return': "Welcome",
            'clients': clients
        }
        return Response(ret)

    def post(self, request, *args, **kwargs):
        lowstate = json.loads(request.body)
        ret = self.exec_lowstate(lowstate)
        return Response(ret)