const url = 'http://127.0.0.1:8000/api/'
Vue.prototype.$API = {
    //获取域名信息，如果传入ID参数将获取🈯️域名信息，默认获取所有
    GetDomain: function (id) {
        if(id){
            var _url = url + 'domain/' + id;
        }else{
            var _url = url + 'domain/';
        }
        return Vue.http.get(_url)
    },

    GetGDAccount: function (id) {
        if (id) {
            var _url = url + 'account/' + id;
        } else {
            var _url = url + 'account/';
        }
        return Vue.http.get(_url)
    },

    DeleteGDAccount: function (url) {
        return Vue.http.delete(url)
    },

    CreateGDAccount: function (item) {
        var _url = url + 'account/';
        return Vue.http.delete(_url, item)
    },

    GetIntance: function () {
        var _url = '/assets/instance';
        return Vue.http.get(_url)
    },
}