import logging

# rest framework imports
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView


# salt imports
import salt.utils
import salt.utils.event
from salt.utils.event import tagify
import salt.client
import salt.runner

logger = logging.getLogger()

# TODO: refreshing clients using cachedict
saltclients = {'local': salt.client.get_local_client().cmd,
               # not the actual client we'll use.. but its what we'll use to get args
               'local_batch': salt.client.get_local_client().cmd_batch,
               'local_async': salt.client.get_local_client().run_job,
               'runner': salt.runner.RunnerClient(salt.config.master_config('/etc/salt/master')).async,
               }

class TimeoutException(Exception):
    pass

class SaltBaseViewSet(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAdminUser,)
    http_method_names = ['get', 'post']


    def get(self, request, *args, **kwargs):
        ret = {"clients": saltclients.keys(),
               "return": "Welcome"}
        return Response(ret)

    def post(self, request, *args, **kwargs):
        ret = {
            "status": 'error'
        }
        client = kwargs.get('client', None)
        return Response(ret)