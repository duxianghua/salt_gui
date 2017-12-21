const url = 'http://127.0.0.1:8000/api/'
Vue.prototype.$API = {
    //获取域名信息，如果传入ID参数将获取🈯️域名信息，默认获取所有
    GetIntance: function () {
        var _url = '/assets/instance';
        return Vue.http.get(_url)
    },
}