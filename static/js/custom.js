/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var URL = window.location.href.split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
$(document).ready(function() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + $FOOTER.height();

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }
            
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $BODY.removeClass('nav-md').addClass('nav-sm');

            if ($SIDEBAR_MENU.find('li').hasClass('active')) {
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            }
        } else {
            $BODY.removeClass('nav-sm').addClass('nav-md');

            if ($SIDEBAR_MENU.find('li').hasClass('active-sm')) {
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }
        }

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function(){  
        setContentHeight();
    });

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel:{ preventDefault: true }
        });
    }
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

function test(table_id) {
    var trList = $("#"+table_id).children("tr")
    var count = 0
    for (var i = 0; i < trList.length; i++) {
        var tdArr = trList.eq(i).find("td");
        var a = tdArr.eq(0).find("input").is(":checked");
        if ( a ) {
            count = count + 1
            tdArr.attr("style", "BACKGROUND-COLOR: #e6f0fc");
        }else{
            tdArr.attr("style", "BACKGROUND-COLOR: none");
        }
    }
    $("#select_count").text(count)
    if ( count > 0 ){
        $("#btn_start").attr('disabled',false);
        $("#btn_stop").attr('disabled',false);
        $("#btn_restart").attr('disabled',false);
    }else{
        $("#btn_start").attr('disabled',true);
        $("#btn_stop").attr('disabled',true);
        $("#btn_restart").attr('disabled',true);
    }
};

function checkall(selfid){
    if ( $("#"+selfid).is(":checked") ){
        //alert('1')
        $("[name^='service']:checkbox").prop("checked", "checked");
    } else {
        //alert('2')
        $("[name^='service']:checkbox").removeAttr("checked");
    }
    test("services_list");
};

function plcz_services(table_id,action) {
    var trList = $("#"+table_id).children("tr")
    var count = $("#select_count").text()
    var aaa = confirm('你确定要'+action+' '+count+'个服务吗？')
    var action_count = 0
    if (aaa){
        for (var i = 0; i < trList.length; i++) {
            var tdArr = trList.eq(i).find("td");
            var a = tdArr.eq(0).find("input").is(":checked");
            if ( a ) {
                var host = tdArr.eq(1).text();
                var service = tdArr.eq(2).text();
                manager_service(host,service,action,tdArr);
                get_service_status(host,service,tdArr);
            }
        }
    }
};

function manager_service(host,service,action,obj){
    obj.eq(3).html("<span style='color: red;'>"+"状态更新中..."+"</span>");
    $.getJSON("/services/turn",{host:host,service:service,action:action},function(result){
    });
};


function get_service_status(host,service,obj){
    setTimeout(
        function(){$.getJSON("/services/status",{host:host,service:service},function(result){
        if (result == true){
            obj.eq(3).html("<span style='color: green;'>"+"start"+"</span>");
        } else{
            obj.eq(3).html("<span style='color: red;'>"+"stop"+"</span>");
        }
    });}
    ,100)
};

function status(){
    $("#services_list tr").each(function() {
        var status = $(this).children().eq(3).text();
        var tdArr = $(this).children();
        var host = $(this).children().eq(1).text();
        var service = $(this).children().eq(2).text();
        tdArr.eq(3).html("<span style='color: red;'>"+"状态更新中..."+"</span>");
        get_service_status(host,service,tdArr);
    });
};

function moveListBoxSelectedItem(select1_id,select2_id){
    var select1 = document.getElementById(select1_id);
    var select2 = document.getElementById(select2_id);
     $(select1).find("option:selected").each(function(){
        $("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo(select2);
         var values = $(select2).val();
         if (values == null){
             $(select2).val([$(this).val()]).prop("selected",true);
         }else {
             var a = values+","+$(this).val()
             var test = a.toString().split(",");
                if (test != null){
                    $(select2).val(test);
            }
         }
        $(this).remove();
    });
};

function add_form_data(form_id,select_id,close_id){
    var formid = document.getElementById(form_id);
    var closeid = document.getElementById(close_id);
    var selectid = document.getElementById(select_id);
    $(closeid).click()
    var values = ""
     $(selectid).find("option").each(function() {
         values = values+$(this).val()+','
     });
    var test = values.toString().split(",");
    if (test != null){
        $(selectid).val(test);
    }
    $(formid).ajaxSubmit(function(message){
        var obj = JSON.parse(message);
        if (obj['status'] == 'ok' ){
            //$(closeid).click();
            window.location.reload();
            alert("成功");
        }else{
            alert("失败\n"+obj['val'])
        }
    });
    return false;
};

function add_host(form_id,id_list){
    for (i in id_list){
        var dome_id = document.getElementById(id_list[i]);
        if (!$(dome_id).val()){
            //$(dome_id).css("border-color","red")
            if (id_list[i] == 'app_cate_lift' ){
                alert("app category is null")
                return false;
            }else{
                alert(id_list[i]+" is null")
                return false;
            }
        }
    }
    var formid = document.getElementById(form_id);
    $(formid).ajaxSubmit(function(message){
        var obj = JSON.parse(message);
        if (obj['status'] == 'ok' ){
            //window.location.href="/assets/host_info/staging";
            alert("成功");
        }else{
            alert("失败\n"+obj['val'])
        }
    });
    return false;
};

function getpage(url,dictparameter,displayID) {
    var displayobj = document.getElementById(displayID);
    $(displayID).html(name);
    $.get(url,dictparameter,function(result){$(displayobj).html(result);});
    return false; //不刷新页面
};

function edit_area(url,ID,displayID) {
    var displayobj = document.getElementById(displayID);
    $.get(url,{action:'edit',id:ID},function(rev){
        $(displayobj).html(rev);
    });
    return false; //不刷新页面
};

function DelItem(url,itemId){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
    });
    $.post(url,{action:'delete',id:itemId},function(obj){
        alert(obj)
        window.location.reload();
    });
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function inventorie_host(windowid,tableid,url){
    var w = document.getElementById(windowid);
    var t = document.getElementById(tableid);
    $(w).show()
    if ( $.fn.dataTable.isDataTable( t ) ){
        var table = $(t).DataTable();
        table.destroy();
        //table.ajax.url( url ).load()
    }
    var table = $(t).dataTable( {
        "lengthMenu": [ 5, 10, 25, 50, 100 ],
        ajax: {url: url,
            dataSrc: ""
        },
        //order: [[ 0, "desc" ]],
        columnDefs: [
            {
                targets: 0,
                data: "host",
                title: "HOST",
                render: function (data, type, row, meta) {
                    return row.host;
                }
            },
            {
                targets: 1,
                data: "status",
                title: "status",
                render: function (data, type, row, meta) {
                if ( row.status.toString() == "true" ){
                    return "<span style='color: #00A000'>" + row.status + "</span>"
                }else{
                    return "<span style='color: #9C2F2F'>" + row.status + "</span>"
                }
            }
            },
        ]
        });
}

function locad_table(tableid,url){
    var t = document.getElementById(tableid);
    if ( $.fn.dataTable.isDataTable( t ) ){
        var table = $(t).DataTable();
        table.destroy();
    }
    $.get(url,function (result) {
        var c = [];
        if(result[0] instanceof Object){
            c[0] = {'':''};
            var i = 1;
             for(x in result[0]){
                 if(typeof result[0][x] == 'string'){
                     c[i] = {'data': x, 'title': x};
                     var i = i +1;
                 };
             };
             c[i] = {'':''};
        };
        $(t).dataTable( {
        "lengthMenu": [ 5, 10, 25, 50, 100 ],
        'data': result,
        columns : c,
            "order": [[ 1, "asc" ]],
        columnDefs:[
            {
                targets: 0,
                "orderable": false,
                render: function (data, type, row, meta) {
                    return '<div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" id="check-all" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>';
                },
                'title':  '<div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" id="check-all" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>'
            },
            {
                targets: -1,
                render: function (data, type, row, meta) {
                    return '<a type="button" class="btn btn-danger btn-block" onclick=delTableID(' + row.id + ') >删除</a>';
                }
            },
                { "orderable": false, "targets": -1 },
                { "orderData": 1,    "targets": 1 },
            ]
        });
    });
}

function delTableID(id) {
    var url = "http://127.0.0.1:8000/assets/api/account/" + id
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
    });
    alert(csrftoken)
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function (result) {
            window.location.reload();
        },
    });

}

function AddFormID(FormID) {
    $("#formId").validate({
              submitHandler:function(form){
                  var data = $('#formId').serializeArray();
                  $.ajax({
                      cache: true,
                      type: "POST",
                    url:"/assets/api/account/",
                    data: data,// 你的formid
                    async: false,
                    error: function(request) {
                        alert("Connection error:"+request.error);
                    },
                    success: function(data) {
                        alert("SUCCESS!");
                    }
                        })
              document.getElementById("formId").reset();
            }
    });
}