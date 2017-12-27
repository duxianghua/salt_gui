var vm = new Vue({
    delimiters: ["[[", "]]"],
    el: "#salt-minions",
    data:{
        Minions: {
            Data: {},
            array: [],
            columns: [
                {isShow: true, label: "主机名",  prop: "Index"},
                {isShow: true, label: "IPV4",   prop: "ipv4", formatter: FormatIP},
                {isShow: true, label: "Domain", prop: "domain"},
                {isShow: true, label: "Cpu个数", prop: "num_cpus"},
                {isShow: true, label: "内存", prop: "mem_total"},
                {isShow: true, label: "系统版本", prop: "osfinger"},
                {isShow: true, label: "系统内核", prop: "kernelrelease", width: 230},
                {isShow: true, label: "DNS", prop: "dns.ip4_nameservers"},
                {isShow: true, label: "cpu模式", prop: "cpu_model", width: 320},
                {isShow: true, label: "SELinux", prop: "selinux.enforced", width: 320},
            ],
        },
        Loading: true,
        dialogVisible: false,
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
            axios.get("http://192.168.1.212/api/minions").then((result)=>{
                this.Minions.Data = result.data.return;
                this.Minions.array = obj_t(this.Minions.Data);
                this.Loading = false;
            });
        },
        Refresh: function () {
          this.Loading = true;
          this.LoadJobs();
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