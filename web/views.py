from .SaltAPI import SaltBaseViewSet
from .SaltAPI import saltclients
from rest_framework.response import Response

class index(SaltBaseViewSet):
    '''
    aaa
    '''


class minions(SaltBaseViewSet):
    def get(self, request, mid=None, **kwargs):
        if mid:
            pass
        c = {'tgt': mid or '*', 'fun': 'grains.items',}
        ret = saltclients['local'](**c)
        return Response(ret)

    def post(self, request, *args, **kwargs):
        pass