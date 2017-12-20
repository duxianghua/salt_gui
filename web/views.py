from .SaltAPI import SaltBaseViewSet
from .SaltAPI import saltclients
from rest_framework.response import Response

class index(SaltBaseViewSet):
    '''
    aaa
    '''


class Minions(SaltBaseViewSet):
    http_method_names = ['get']
    def get(self, request, mid=None, **kwargs):
        c = {'tgt': mid or '*', 'fun': 'grains.items',}
        ret = saltclients['local_batch'](**c)
        return Response(ret)


class Jobs(SaltBaseViewSet):
    http_method_names = ['get']
    def get(self, request, jid=None, **kwargs):
        self.lowstate = [{
            'fun': 'jobs.lookup_jid' if jid else 'jobs.list_jobs',
            'jid': jid,
        }]

        if jid:
            self.lowstate.append({
                'fun': 'jobs.list_job',
                'jid': jid,
            })

        self.disbatch('runner')
        ret = saltclients['local_batch'](**c)
        return Response(ret)