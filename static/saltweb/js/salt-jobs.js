var vm = new Vue({
    delimiters: ["[[", "]]"],
    el: "#salt-jobs",
    data:{
        JobsData: [],
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
            axios.get('http://192.168.1.212/api/jobs').then((result)=>{
                this.JobsData = result.data
            });
        },
      }
});

Vue.http.interceptors.push((request, next) => {
    var csrftoken = getCookie('csrftoken');
    request.headers.set('Authorization', 'Token 215a4d5fca132d87df8f68f48e8373d6bf1ffc16');
    request.headers.set('Content-Type', 'application/json');
    request.headers.set('Access-Control-Allow-Origin', '*');
    next((request) =>{
        return request
    });
});