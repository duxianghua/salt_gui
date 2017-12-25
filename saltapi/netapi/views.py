# sys lib imports
from functools import wraps
import logging
import json
import datetime
import os


# rest framework imports
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

import salt.config

import saltapi
from ..utils import files

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

    def exec_lowstate(self, low):
        now_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ret = {'return': '', 'time': now_time, 'error': None}
        if 'arg' in low and not isinstance(low['arg'], list):
            low['arg'] = [low['arg']]
        try:
            data = self.api.run(low)
            ret['return'] = data
        except Exception as e:
            ret['error'] = str(e)
        return ret


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
        print mid
        low = {'client': 'local', 'tgt': mid or '*', 'fun': 'grains.items',}
        ret = self.exec_lowstate(low)
        return Response(ret)

class Jobs(BaseView):
    http_method_names = ['get']
    def get(self, request, jid=None, *args, **kwargs):
        low = {
            'client': 'runner',
            'fun': 'jobs.list_job' if jid else 'jobs.list_jobs',
            'jid': jid,
        }
#        try:
#            data = self.api.run(low)
#        except Exception as e:
#            return Response({'success':False, 'error': '%s' %str(e)}, status=500)
#
#        def format(d):
#            l = []
#            for k, v in d.items():
#                v['jid'] = k
#                l.append(v)
#            return l
#
#        if not jid:
#            ret = {'result': format(data)}
#        else:
#            ret = {'result': data}
        ret = self.exec_lowstate(low)
        return Response(ret)


class Grains(BaseView):
    pass


class Pillar(BaseView):
    pass


class StateTemplate(BaseView):
    def get(self, request, fid=None, *args, **kwargs):
        path=self.opts['file_roots']['base'][0]
        if fid:
            path = os.path.join(path, files.id2file(fid))
            print path
        ret = {'result': path}
        ret['result'] = files.rd(path)
        return Response(ret)

    def post(self, request, *args, **kwargs):
        file_roots=self.opts['file_roots']['base'][0]
        try:
            receive = json.loads(request.body)
        except Exception as e:
            ret = { "result": {"success": False, "error": "Parameter error: %s" %str(e)}}
            return Response(ret, status=500)
        if 'path' in receive:
            receive['path'] = os.path.join(file_roots, receive['path'][1:])

        if 'newPath' in receive:
            receive['newPath'] = os.path.join(file_roots, receive['newPath'][1:])

        if 'item' in receive:
            receive['item'] = os.path.join(file_roots, receive['item'][1:])

        if 'items' in receive:
            receive['items'] = [ os.path.join(file_roots, item[1:]) for item in receive['items']]

        if 'newItemPath' in receive:
            receive['newItemPath'] = os.path.join(file_roots, receive['newItemPath'][1:])

        print receive
        try:
            fun = getattr(files, receive['action'])
            ret = {'result': fun(**receive)}
            return Response(ret)
        except Exception as e:
            ret = {"result": {"success": False, "error": "%s" % str(e)}}
            return Response(ret, status=500)