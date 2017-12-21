var vm = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data:{
        TreeData: {},
    },
    filters: {

    },
    mounted: function () {
        this.$nextTick(function () {
            this.createView();
        });
    },
    computed: {
    },
    methods: {
        createView: function () {
            axios.get('/api/files').then((result)=>{
               this.TreeData = result.data.return;
                $('#using_json_2').jstree({
                        'core': {
                            'data': this.TreeData}
                    });
            });
        },
      }
});