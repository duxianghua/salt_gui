# sys lib imports
from functools import wraps
import logging
import json
import datetime


# rest framework imports
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

import salt.config

import saltapi

class BaseView(APIView):
    now_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ret = {'return': '', 'time': now_time, 'error': None}
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
        try:
            data = self.api.run(lowstate)
            self.ret['return'] = data
        except Exception as e:
            self.ret['error'] = str(e)
        return self.ret


    def get(self, request, *args, **kwargs):
        import inspect
        clients = [name for name, _ in inspect.getmembers(saltapi.APIClient,
                predicate=inspect.ismethod) if not name.startswith('__')]
        clients.remove('run')
        self.ret['return'] = "Welcome"
        self.ret['client'] = clients

        return Response(self.ret)

    def post(self, request, *args, **kwargs):
        lowstate = json.loads(request.body)
        ret = self.exec_lowstate(lowstate)
        return Response(ret)

class Minions(BaseView):
    http_method_names = ['get']
    def get(self, request, mid=None, *args, **kwargs):
        lowstate = {'client': 'local', 'tgt': mid or '*', 'fun': 'grains.items',}
        ret = self.exec_lowstate(lowstate)
        return Response(ret)

class Jobs(BaseView):
    http_method_names = ['get']
    def get(self, request, jid=None, *args, **kwargs):
        lowstate = {
            'client': 'runner',
            'fun': 'jobs.lookup_jid' if jid else 'jobs.list_jobs',
            'jid': jid,
        }

        #if jid:
        #    lowstate.append({
        #        'client': 'runner',
        #        'fun': 'jobs.list_job',
        #        'jid': jid,
        #    })
        ret = self.exec_lowstate(lowstate)
        print ret
        return Response(ret)

