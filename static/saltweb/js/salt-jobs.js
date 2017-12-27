var vm = new Vue({
    delimiters: ["[[", "]]"],
    el: "#salt-jobs",
    data:{
        Jobs: {
            Data: {},
            array: [],
            columns: [
                {isShow: true, label: "ID",  prop: "Index"},
                {isShow: true, label: "函数",   prop: "Function"},
                {isShow: true, label: "目标主机", prop: "Target"},
                {isShow: true, label: "执行用户", prop: "User", width: 80},
                {isShow: true, label: "开始时间", prop: "StartTime", width: 230},
                {isShow: true, label: "类型", prop: "Target-type", width: 80},
                {isShow: true, label: "参数", prop: "Arguments"}
            ],
        },
        Loading: true,
        dialogVisible: false,
        Result: {}
    },
    filters: {
    },
    mounted: function (){
        this.$nextTick(function () {
            this.LoadJobs();
        });
    },
    computed: {
    },
    methods: {
        LoadJobs: function () {
            axios.get("http://192.168.1.212/api/jobs").then((result)=>{
                this.Jobs.Data = result.data.return;
                this.Jobs.array = obj_t(this.Jobs.Data);
                this.Loading = false;
            });
        },
        Refresh: function () {
          this.Loading = true;
          this.LoadJobs();
        },
        get_job: function (row, event) {
            url = "http://192.168.1.212/api/jobs"+ "/" + row.Index;
            axios.get(url).then((result)=>{
                "use strict";
                this.Result = result.data.return.Result;
            });
        }
      }
});

Vue.http.interceptors.push((request, next) => {
    const csrftoken = getCookie("csrftoken");
    request.headers.set("Authorization", "Token 215a4d5fca132d87df8f68f48e8373d6bf1ffc16");
    next((request) =>{
        return request
    });
});