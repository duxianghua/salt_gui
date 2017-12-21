var vm = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data:{
        InstanceArray: {
            data: [],
            pageIndex: 1,
            pageSize: 5,
            pageSizes: [5, 10, 25],
            filterKey: "",
            total: 0,
        },
        AccountArray: {
            data: [],
            pageIndex: 1,
            pageSize: 10,
            pageSizes: [5, 10, 25, 50],
            filterKey: "",
            total: 0,
        },
        DomainArray: {
            data: [],
            pageIndex: 1,
            pageSize: 10,
            pageSizes: [5, 10, 25, 50],
            filterKey: "",
            total: 0,
            loading: false,
        },
        checkalltag: false,
        dditem: {},
        error: '',
        filterKey: '',
        aLengthMenu: [5, 10, 25, 50],
        ShowNumber: 5,
        ShowForm: false,
        FormGoddayAccount: {
            account: '',
            password: '',
            Key: '',
            Secret: '',
            url: '/api/account/',
        },
        numberValidateForm:  { age:''},
        rules:{
            account: [
            { required: true, message: '请输入账号'},
            {type: 'number', message:'账号为数字类型'}
          ],
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
        FilterData: function () {
            return Pagination(this.AccountArray)
        },
        Pagination: function () {
            return Pagination(this.DomainArray)
        },
        Instances: function () {
            return Pagination(this.InstanceArray)
            //return this.InstanceArray.data;
            //this.InstanceArray.total = this.InstanceArray.data.length();
        },
    },
    methods: {
        createView: function () {
            this.$API.GetGDAccount().then((result) => {
                this.AccountArray.data = result.data
            });

            this.$API.GetDomain().then((result)=>{
                this.DomainArray.data = result.data;
            });

            this.$API.GetIntance().then((result)=>{
                this.InstanceArray.data = result.data.Reservations;
            });
        },
        selected: function (iteam) {
            "use strict";
            if(typeof iteam.checked === 'undefined'){
                this.$set(iteam, "checked", true);
            }else{
                iteam.checked = !iteam.checked;
            }
        },

        checkall: function (items) {
            this.checkalltag = !this.checkalltag
            if(this.checkalltag){
                this.FilterData.forEach(function (value, index) {
                    vm.selected(value);
                    value.checked = true;
                });
            }else{
                 this.FilterData.forEach(function (value, index) {
                     vm.selected(value);
                      value.checked = false;
                 });
            }
        },
        DeleteData: function (item, array) {
            if(typeof item.url === 'undefined'){
                this.$message({
                    type: 'error',
                    message: 'No Find Url!'
                });
                return false
            };
            this.$http.delete(item.url).then(function (result) {
                var index = array.data.indexOf(item);
                array.data.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                });
            }).catch((result) => {
                alert(result);
                this.$message({
                    type: 'error',
                    duration: '6000',
                    message: result.bodyText
                });
            });
        },
        DeleteWindow: function (item, array) {
            this.$confirm('此操作将删除账号信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.DeleteData(item, array);
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
        },
        SubmitForm: function (formName) {
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.$http.post(this.FormGoddayAccount.url, this.FormGoddayAccount).then(function (result) {
                        this.$message({
                        type: 'success',
                        message: '添加Godday成功!',
                        });
                        this.createView();
                        this.$refs[formName].resetFields();
                    }).catch((result) => {
                        this.$message({
                            type: 'error',
                            duration: '6000',
                            message: result.bodyText
                        });
                    });
                }else{
                    return false;
                }
            })
        },
        sizeChange: function (pageSize) {
            this.DomainArray.pageSize = pageSize;
        },
        pageChange: function (currentPage) {
            this.DomainArray.pageIndex = currentPage;
        },
        Pagination1: function (array) {
            var filterKey = array.filterKey && array.filterKey.toLowerCase();
            var start = array.pageIndex * array.pageSize - array.pageSize;
            var end = start + array.pageSize;
            var data = array.data;
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        if(key === 'url' || key === 'pid'){
                            return false;
                        };
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                    });
                });
            };
            array.total = data.length;
            return data.slice(start, end);
        },
        SyncDomainInfo: function () {
            this.DomainArray.data = [];
            this.DomainArray.loading = true;
            this.$http.get('/assets/domain/sync').then(function (result) {
                var res = JSON.parse(result.bodyText);
                if(res.status === 'ok'){
                   this.$http.get('/assets/api/domain').then((result) => {
                        this.DomainArray.data = _.orderBy(JSON.parse(result.bodyText), 'domain');
                    });
                };
                this.DomainArray.loading = false;
                this.$message({
                            type: 'success',
                            duration: '3000',
                            message: '数据同步成功'
                });
            }).catch((result) => {
                this.$message({
                            type: 'error',
                            duration: '6000',
                            message: result.bodyText
                });
                this.DomainArray.loading = false;
            });
        }
      }
});

Vue.http.interceptors.push((request, next) => {
    var csrftoken = getCookie('csrftoken');
    request.headers.set('X-CSRFToken', csrftoken);
    next((request) =>{
        return request
    });
});