function Pagination(array){
    if(typeof array.pageIndex === 'undefined'){
        array.pageIndex = 1;
    };
    if(typeof array.pageSize === 'undefined'){
        array.pageSize = 10;
    };
    if(typeof array.pageSizes === 'undefined'){
        array.pageSizes = [5, 10, 25, 50];
    };
    if(typeof array.total === 'undefined'){
        array.total = 0;
    };
    var filterKey = array.filterKey && array.filterKey.toLowerCase();
    var start = array.pageIndex * array.pageSize - array.pageSize;
    var end = start + array.pageSize;
    var data = array.data;
    if(filterKey){
        data = Search(filterKey, array.data, ['url'])
    }
    array.total = data.length;
    return data.slice(start, end);

}

function Search(filterKey, array, exclude){
    var filterKey = filterKey && filterKey.toLowerCase();
    var data = array
    if (filterKey) {
        data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
                if(exclude.indexOf(key) > -1){
                    return false;
                }else{
                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                };
            });
        });
    };
    return data
}

function DeleteData(item, array) {
    Vue.$API.DeleteGDAccount(item.url).then((result) => {
            var index = array.data.indexOf(iteam);
            array.data.splice(index, 1);
            promise()
        }).catch((result) => {
        });
    }


Vue.prototype.$dxhtest = {
    aaa: function (x) {
        this.$message({
            type: 'success',
            message: '删除成功!',
        })
    }
}