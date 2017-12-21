const url = 'http://127.0.0.1:8000/api/'

function GetDomain(id) {
    if(id){
        var _url = url + 'domain/' + id;
    }else{
        var _url = url + 'domain/';
    }
    return Vue.http.get(_url)
}

function GetGoddayAccount(id) {
    if(id){
        var _url = url + 'account/' + id;
    }else{
        var _url = url + 'account/';
    }
    return Vue.http.get(_url)
}
