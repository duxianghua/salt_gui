/**
 * Created by duxianghua on 16/9/29.
 */
angular.module('SaltFish', [])
.controller('SaltFishCtrl', function($scope, $http) {
    $scope.show_panel = false;

    $scope.Working = false;

    $scope.load_page = function(path){
        $scope.page_path = path;
        $scope.show_panel = true;
    };
    $scope.close_panel = function () {
        $scope.show_panel = false;
    };
    $scope.load_table = function (path) {
        $http.get(path)
            .success(function (response) {$scope.tables = response;});
    };

    $scope.load_table("/saltfish/api/v1/repo/");

    var csrftoken = getCookie('csrftoken');

    //初始化form表单数据
    $scope.AddRepo = function() {
        $scope.load_page('/saltfish/repo/add/')
        $scope.formData = {
        "name": "",
        "git_url": "",
        "git_branch": "",
        "status": 0,
        "description": "",
        "last_update_time": null,
        "regions": null,
        "log": null,
        "SomeField":{
            "regions_list":[]
            }
        }
        $http({
            method  : 'GET',
            url     : "/saltfish/api/v1/saltinterface/",
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    $scope.formData.SomeField.regions_list = response.data
                }, function errorCallback(response) {
                    alert(response)
            });
    }
    $scope.SaveFrom = function() {
        $http({
            method  : 'POST',
            url     : "/saltfish/api/v1/repo/",
            data    : $scope.formData,
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    alert("添加成功");
                    $scope.load_table("/saltfish/api/v1/repo/");
                }, function errorCallback(response) {
                    $scope.formDataError = response.data;
            });
    };
    $scope.EditForm = function(id) {
        $scope.Working = true;
        $http({
            method  : 'GET',
            url     : "/saltfish/api/v1/repo/"+id,
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    $scope.formData = response.data;
                    $scope.show_panel = true;
                }, function errorCallback(response) {
                    alert(response);
            });
        $scope.Working = false;
    };
    $scope.DeleteForm = function(id) {
        $http({
            method  : 'POST',
            url     : "/saltfish/repo/" + id + "/delete",
            data    :   {'id': id},
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    $scope.load_table("/saltfish/api/v1/repo/")
                }, function errorCallback(response) {
                    alert(response)
            });
    };
    $scope.UpdateRepo = function(id) {
        $http({
            method  : 'POST',
            url     : "/saltfish/repo/" + id + "/update",
            data    :   {'id': id},
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    $scope.load_table("/saltfish/api/v1/repo/")
                }, function errorCallback(response) {
                    alert(response.data)
            });
    };

})
    .controller('SaltFishCtrl_inventories', function($scope, $http) {
        var csrftoken = getCookie('csrftoken');

        $scope.load_table = function (path) {
            $http.get(path)
                .success(function (response) {$scope.tables = response;});
        };

        $scope.load_table("/saltfish/api/v1/inventories/");

        $scope.show_panel = false;
        $scope.show_tree = false;

        $scope.Working = false;

        $scope.AddInventories = function(){
            $scope.show_panel = true;
            $scope.formData = {
                "name": "",
                "expr_form": "glob",
                "       tgt": "",
                "variables": "",
                "description": "",
                "regions": null,
                "SomeField": {
                    "regions_list":[],
                    "expr_form": {
                        "pcre": "pcre",
                        "grain_pcre": "grain_pcre",
                        "glob": "glob",
                        "list": "list",
                        "range": "range",
                        "grain": "grain",
                        "compound": "compound",
                        "pillar_pcre": "pillar_pcre",
                        "nodegroup": "nodegroup",
                        "pillar": "pillar"
                        }}}
            $http({
                method  : 'GET',
                url     : "/saltfish/api/v1/saltinterface/",
                headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
                })
                .then(function successCallback(response) {
                        $scope.formData.SomeField.regions_list = response.data
                    }, function errorCallback(response) {
                        alert(response)
                });
        };

        $scope.SaveFrom = function() {
        $http({
            method  : 'POST',
            url     : "/saltfish/api/v1/inventories/",
            data    : $scope.formData,
            headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
            })
            .then(function successCallback(response) {
                    alert("添加成功");
                    $scope.load_table("/saltfish/api/v1/inventories/");
                }, function errorCallback(response) {
                    alert(response.data)
                    $scope.formDataError = response.data;
            });
        };

        $scope.EditForm = function(id) {
            $scope.Working = true;
            $http({
                method  : 'GET',
                url     : "/saltfish/api/v1/inventories/"+id,
                headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
                })
                .then(function successCallback(response) {
                        $scope.formData = response.data;
                        $scope.show_panel = true;
                    }, function errorCallback(response) {
                        alert(response);
                });
            $scope.Working = false;
        };

        $scope.DeleteForm = function(id) {
            $http({
                method  : 'DELETE',
                url     : "/saltfish/api/v1/inventories/" + id,
                headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
                })
                .then(function successCallback(response) {
                        $scope.load_table("/saltfish/api/v1/inventories/")
                    }, function errorCallback(response) {
                        alert(response.data)
                });
        };

        $scope.inventorie_tree = function(id) {
            $scope.show_tree = true;
            var url = "/saltfish/inventories/" + id + "/list";
            var test = locad_table('inventorie-table',url);
        };


})
    .controller('SaltFishCtrl_Job', function($scope, $http) {
        var csrftoken = getCookie('csrftoken');
        $scope.Working = false;
        $scope.Job = {};
        function LoadData(url){
            $scope.Working = true;
            $http.get(url)
                .success(function (response) {
                    $scope.items = response;
                    $scope.Working = false;
                });
        };
        $scope.items = [];
        $scope.SelectValue = function(url){
            $scope.items = [];
            $scope.itemsPerPage = 5;
            $scope.currentPage = 0;
            $scope.pageCount = function() {
                return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
            };
            $scope.prevPage = function() {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };
            $scope.nextPage = function() {
                if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++; }
            };
            $scope.PageList = function(){
                var PageRange = [];
                for (var i=0; i<=$scope.pageCount(); i++) {
                    PageRange.push(i);
                }
                return PageRange;
            };
            $scope.setPage = function (Page) {
                $scope.currentPage = Page

            }
            LoadData(url)
        };

        $scope.model_setup = function(){
            $scope.Working = true;
            $http({
                method  : 'POST',
                url     : "/saltfish/staterun",
                data    : $scope.Job,
                headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
                })
                .then(function successCallback(response) {
                        $scope.rev_value = JSON.stringify(response.data, null, 2);
                        $scope.Working = false;
                    }, function errorCallback(response) {
                        $scope.Working = false;
                        alert(response.data);
                });
        };
})
    .controller('SaltFishCtrl_Job1', function($scope, $http) {
        var csrftoken = getCookie('csrftoken');
        $scope.JOB = {};
        $scope.Loading = {};

        $scope.c0 = function () {
            $scope.Loading.Region = true;
            $http.get('/saltfish/api/v1/saltinterface/')
                .success(function (response){
                    $scope.Regions = response;
                    $scope.JOB.Region = response[0].name;
                    $scope.Loading.Region =false;
                    $scope.c1();
            });
        };


        $scope.c1 = function () {
            $scope.Loading.Group = true;
            $http.get('/saltfish/api/v1/inventories/')
                .success(function (response){
                    $scope.Groups = response;
                    $scope.JOB.Group = response[0].id;
                    $scope.Loading.Group = false;
                    $scope.c2();
            });
        };

        $scope.c2 = function () {
            $scope.Loading.SaltEnv = true;
            url = '/saltfish/saltenv?region=' + $scope.JOB.Region
            $http.get(url)
                .success(function (response){
                    $scope.SaltEnv = response;
                    $scope.JOB.SaltEnv = response[0];
                    $scope.Loading.SaltEnv = false;
                    $scope.c3();
            });
        };

        $scope.c3 = function () {
            $scope.Loading.SaltSLS = true;
            url = '/saltfish/saltsls?region='+ $scope.JOB.Region + '&env=' + $scope.SaltEnv
            $http.get(url)
                .success(function (response){
                    $scope.SaltSLS = response;
                    $scope.JOB.SaltSLS = response[0];
                    $scope.Loading.SaltSLS = false;
            });
        };

        $scope.save = function () {
            console.log("log:",$scope.JOB)
             $http({
                method  : 'POST',
                url     : "/saltfish/staterun",
                data    : JSON.stringify($scope.JOB),
                params  : $scope.JOB,
                headers : { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken }
                })
                .then(function successCallback(response) {
                        $scope.rev_value = JSON.stringify(response.data, null, 2);
                        alert($scope.rev_value);
                    }, function errorCallback(response) {
                        alert(response.data);
                });
        }

        $scope.c0();

        $scope.isShowScroll = function () {
			return $("#dvTbody").height() < $("#tbTbody").height();
        };
        $scope.iteams = {};
        $scope.load_table = function (path) {
            $http.get(path)
                .success(function (response) {$scope.iteams = response;});
        };
        $scope.load_table('/saltfish/api/v1/state_exec/');

        $scope.click_test = function(id) {
            if ( id != null ){
                $http.get('/saltfish/api/v1/log/'+id)
                .success(function (response) {
                    $scope.Log = response['value']
                });
            }else{
                $scope.Log = "No DATA"
            }

        };

})
.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})

.filter('offset', function() {
    return function(input, start) {
        console.log("------------------------------------------------- begin dump of");
        var data = input;
        start = parseInt(start, 10);
        //console.log("input=", data.slice(start));
        return data.slice(start);}
});