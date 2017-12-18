from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView


class ViewSet(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAdminUser,)
    http_method_names = ['get', 'post']
    content = {
        'status': 'ok'
    }

    def get(self, request, *args, **kwargs):
        return Response(self.content)

    def post(self, request, *args, **kwargs):
        return Response(self.content)


class aaa(ViewSet):
    def post(self, request, *args, **kwargs):
        return Response(self.content)
