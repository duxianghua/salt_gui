var vm = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app_aws',
    data:{
        InstanceArray: {
            data: [],
            pageIndex: 1,
            pageSize: 10,
            pageSizes: [5, 10, 25],
            filterKey: "",
            total: 0,
            loading: true,
        },
    },
    filters: {

    },
    mounted: function () {
        this.$nextTick(function () {
            this.createView();
        });
    },
    computed: {
        Instances: function () {
            return Pagination(this.InstanceArray)
        },
    },
    methods: {
        createView: function () {
            this.$API.GetIntance().then((result)=>{
                this.InstanceArray.data = result.data.Reservations;
                this.InstanceArray.loading = false;
            });
        },
      }
});

Vue.http.interceptors.push((request, next) => {
    var csrftoken = getCookie('csrftoken');
    request.headers.set('X-CSRFToken', csrftoken);
    next((request) =>{
        return request
    });
});