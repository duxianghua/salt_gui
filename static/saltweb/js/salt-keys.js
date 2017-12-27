var vm = new Vue({
    delimiters: ["[[", "]]"],
    el: "#salt-keys",
    data:{
        Keys: {},
        Loading: true,
        dialogVisible: false,
        Result: {},
        activeName: "1",
    },
    filters: {
    },
    mounted: function (){
        this.$nextTick(function () {
            this.LoadKeys();
        });
    },
    computed: {
    },
    methods: {
        LoadKeys: function () {
            axios.get("http://192.168.1.212/api/keys").then((result)=>{
                this.Keys = result.data.result;
                this.Loading = false;
            }).catch((error)=>{
                    "use strict";
                    alert(error);
                });
        },
        Refresh: function () {
          this.Loading = true;
          this.LoadKeys();
        },
        handleAction: function (action, minions) {
            "use strict";
            const per = {action: action, minions: minions};
            axios.post("http://192.168.1.212/api/keys", per)
                .then((result)=>{
                    "use strict";
                    this.LoadKeys();
                })
                .catch((error)=>{
                    "use strict";
                    alert(error);
                });
        },
        SingleDelete: function(row) {
            "use strict";
            this.handleAction("delete", [row.mid])
        },
        SingleAccept: function(row) {
            "use strict";
            this.handleAction("accept", [row.mid])
        },
        SingleReject: function(row) {
            "use strict";
            this.handleAction("reject", [row.mid])
        },
      }
});

Vue.http.interceptors.push((request, next) => {
    const csrftoken = getCookie("csrftoken");
    request.headers.set("Authorization", "Token 215a4d5fca132d87df8f68f48e8373d6bf1ffc16");
    next((request) =>{
        return request
    });
});