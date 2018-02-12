
//获取人员grid
var gridInitUrl = DSJS.getWebRoot() + '/person/queryPerson';
//删除多个数据
var deteleMUrl = null;
var queryForm = {
    queryData : {
        personame : '',
        political : '',
        idno : '',
        enable : false
    }
};
//定义数据格式
var dataStore = new com.dscomm.DataStore();
dataStore.data = new Array();
dataStore.query.queryForm = queryForm;
//生成表时需要的字典
dataStore.enums = {
    "BASIC_ZZMM" : {key:"",enumItems:[]},
    "BASIC_XB" : {key:"",enumItems:[]}
};
//高度计算
$(function() {
    // 设置grid的高度
    // 计算出剩余高度
    var seo_h = $('#seo').height();
    var add_h = $('#add').height();
    var gird_head_h = $('#grid .k-grid-header').outerHeight();
    var gird_bottom_h = $('#grid .k-grid-pager').outerHeight();
    $('#grid').height($(window).height() - 61-2 - seo_h - add_h);
    $('#grid .k-grid-content').height($(window).height() -  61-2 - seo_h - add_h - gird_head_h - gird_bottom_h);
    $(window).resize(
        function() {
            $('#grid').height($(window).height() - 63 - 3 - seo_h - add_h);
            $('#grid .k-grid-content').height($(window).height() -  61-2 - seo_h - add_h - gird_head_h - gird_bottom_h);
        });
});

// 生成表格，填充数据
var dataSource = null;
angular.module("myApp", [ "kendo.directives" ]).controller("siteCtrl",function($http, $scope) {
    $scope.dataStore = dataStore;

    /*事件触发：
     * 初始化
     * 条件查询数据
     * 分页
     * 每页条数
     */

    $scope.readData = function() {
        var _dataStore = new com.dscomm.DataStore();
        _dataStore.query = $scope.dataStore.query;
        if(!isEnumsValid($scope.dataStore.enums)){
            _dataStore.enums = $scope.dataStore.enums;
        }
        $http.post(gridInitUrl,_dataStore).success(function(data) {
        	console.log(data);
            if (data.status == DSJS.ResultStatus.OK) {
                if(data.dataStore==null||data.dataStore.length==0) {
                    return;
                }
                console.log(JSON.stringify(data));
                $scope.dataStore.data = data.dataStore.data;
                $scope.dataStore.query = data.dataStore.query;
                if(isEnumsValid(data.dataStore.enums)){
                    $scope.dataStore.enums = data.dataStore.enums;
                    $scope.dataStore.enums.BASIC_ZZMM.enumItems.splice(0,0,{text:"所有",value:""});//添加清空功能
                }

                dataSource.read();
                //点击行选中checkBox事件注册
                $scope.rowClick();
            }else{
                kendo.alert("错误信息--" + data.msg)
            }

        }).error(function(a, b, c) {
            kendo.alert("请求数据失败 " + b);
        });
    };
    // 第一次加载数据
    $scope.readData();
    /*
    **无分页情况：
    * dataSource = new kendo.data.DataSource({
      data : $scope.dataStore.data,
         schema : {
             data : function(response) {
                return $scope.dataStore.data;
            }
        }
     });
     在生成grid时pageable设置为false
    *
    */
    dataSource = new kendo.data.DataSource({
        data : $scope.dataStore.data,
        schema : {
            data : function(response) {
                return $scope.dataStore.data;
            },
            total : function(response) {
                return $scope.dataStore.query.pageForm.totalSize;
            }
        },
        serverPaging : true,
        pageSize : $scope.dataStore.query.pageForm.pageSize,
        change : function() {
            if (this._page != $scope.dataStore.query.pageForm.currentPage) {
                // 分页
                $scope.dataStore.query.pageForm.currentPage = this._page;
                $scope.readData();
            } else if (this._pageSize != $scope.dataStore.query.pageForm.pageSize) {
                //每页显示条数
                $scope.dataStore.query.pageForm.pageSize = this._pageSize;
                $scope.dataStore.query.pageForm.currentPage = 1;
                $scope.readData();
            }
        }
    });

    $("#grid").kendoGrid({
        dataSource : dataSource,
        scrollable : true,
        sortable : false,
        //无分页情况，pageable:false
        pageable : {
            refresh : false,
            pageSizes : [ 10, 20, 40 ],
            buttonCount : 10
        },
        selectable : "row",
        columns : [
            {
                field : "Choice",
                title : "&nbsp;",
                template : "<input type='checkbox' id='#: personId #' class='danjirow' />",
                width : "30px",
                attributes : {
                    style : "text-align:center;"
                }
            },
            {
                field : "personName",
                title : "姓名",
                width : "100px",
                template : "<a>#: personName #</a>",
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:left;cursor:pointer;text-indent:5px;"
                }
            },
            {
                field : "sex",
                title : "性别",
                width : "50px",
                template:function (row) {
                    return $scope.getEnumText(row["sex"],"BASIC_XB");
                },
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:center;"
                }
            },
            {
                field : "identityNo",
                title : "身份证号",
                width : "120px",
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:center;"
                }
            },
            {
                field : "birthday",
                title : "出生日期",
                template : function(row) {
                    return birthTime(row.birthday);
                },
                width : "100px",
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:center;"
                }
            },
            {
                field : "personOrg[0].name",
                title : "用户单位",
                width : "150px",
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:center;"
                }
            },
            {
                field : "policeNumber",
                title : "用户工号",
                width : "80px",
                headerAttributes : {
                    style : "text-align:left;text-indent:5px;"
                },
                attributes : {
                    style : "text-align:left;text-indent:5px;"
                }
            },
            {
                field : "createTime",
                title : "入职时间",
                width : "100px",
                template : function(row) {
                    return birthTime(row.createTime);
                },
                headerAttributes : {
                    style : "text-align: center"
                },
                attributes : {
                    style : "text-align:left;text-indent:5px;"
                }
            }]
    });
    // 删除多个数据
    $scope.search = function() {
        // 用来保存被选中的行
        var personIdCheck = [];
        $('#grid table tbody tr .on').each(function (i) {
            personIdCheck.push($(this).attr('id'));
        });
        if (personIdCheck.length > 0) {
            kendo.confirm("确定删除？").then(function () {
                $http.post(deteleMUrl, personIdCheck).success(function (res) {
                    if (res.ret == DSJS.ResultStatus.OK && res.dataStore == true) {
                        $scope.readData()
                    } else {
                        kendo.alert("错误信息--" + res.msg)
                    }
                }).error(function (a, b, c) {
                    kendo.alert("删除数据失败！")
                });
            }, function () {
                return false;
            })
        } else {
            kendo.alert("请选择需要删除的数据！");
        }
    }
    
    // 删除多个数据
    $scope.deleteMore = function() {
        // 用来保存被选中的行
        var personIdCheck = [];
        $('#grid table tbody tr .on').each(function(i) {
            personIdCheck.push($(this).attr('id'));
        });
        if (personIdCheck.length > 0) {
            kendo.confirm("确定删除？").then(function() {
                $http.post(deteleMUrl, personIdCheck).success(function(res) {
                    if (res.ret == DSJS.ResultStatus.OK&& res.dataStore == true) {
                        $scope.readData()
                    }else{
                        kendo.alert("错误信息--" + res.msg)
                    }
                }).error(function(a, b,c) {
                    kendo.alert("删除数据失败！")
                });
            }, function() {
                return false;
            })
        } else {
            kendo.alert("请选择需要删除的数据！");
        }

    };

    // checkbox选中效果
    $scope.rowClick=function(){
        $('#grid table tbody tr').each(function(i) {
            var key = true;
            $(this).on('click', function() {
                if (key) {
                    $(this).find('.danjirow').prop('checked',true);
                    $( this).find('.danjirow').toggleClass('on');
                    key = !key;
                } else {
                    $(this).find('.danjirow').prop('checked', false);
                    $(this).find('.danjirow').toggleClass('on');
                    key = !key;
                }
            })
        });
    };
    //清空查询条件
    $scope.delCondition=function(){
        $scope.dataStore.query.queryForm.queryData={
            personame : '',
            political : '',
            idno : '',
            enable : false
        };
    };

    // 初始化弹出网页--add
    $scope.showaddDlg = function() {
        $scope.winEdit.title("新增");
        $scope.winEdit.refresh({url : "editPerson.html?personId=" + "" + "&actiontype="+DSJS.ActionType.ADD});
        $scope.winEdit.center();
        $scope.winEdit.open();
    };

    // 弹出网页--edit
    $scope.winEditOption = {
        width : 910,
        height : 730,
        modal : true,
        iframe : true,
        visible : false,
        draggable : false,
        resizable : false
    };

    // 生成表时，时间毫秒转换--日期
    var birthTime = function(time) {
        var oldTime = new Date(time);
        return oldTime.getFullYear() + "/"+ (oldTime.getMonth() + 1) + "/"+ oldTime.getDate();
    };

    $scope.getEnumText = function (val, key) {
        var items = $scope.dataStore.enums[key].enumItems;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].value === val) {
                    return items[i].text;
                }
            }
        }

        return val;
    };

});

/* 初始化编辑弹窗 */
function showEditDlg(obj) {
    if(window.event){
        var e = window.event;
        e.cancelBubble = true;
    }
    var appElement = $("[ng-controller='siteCtrl']");
    var kgrid = $("#grid").data("kendoGrid");
    if (kgrid == null || typeof (kgrid) == "undefined") {
        return;
    }
    var dataedit = kgrid.dataItem($(obj).closest("tr"));
    var scope = angular.element(appElement).scope();
    scope.winEdit.title("编辑");
    scope.winEdit.refresh({url : "editWeb.html?personId=" + dataedit.personId + "&actiontype="+DSJS.ActionType.MODIFY});
    scope.winEdit.center();
    scope.winEdit.open();
}
// 个人详情--初始化弹出Web
function showEdtailDlg(obj) {
    if(window.event){
        var e = window.event;
        e.cancelBubble = true;
    }
    var appElement = $("[ng-controller='siteCtrl']");
    var kgrid = $("#grid").data("kendoGrid");
    if (kgrid == null || typeof (kgrid) == "undefined") {
        return;
    }
    var dataedit = kgrid.dataItem($(obj).closest("tr"));
    var scope = angular.element(appElement).scope()
    scope.winDetail.title("人员详情");
    scope.winDetail.refresh({
        url : "persondetail.html?personId=" + dataedit.personId + "&actiontype="+DSJS.ActionType.VIEW
    });
    scope.winDetail.center();
    scope.winDetail.open();
}

// 删除操作--如果用自带的command生成的按钮会导致事件注册多次
function destoryM(obj) {
    if(window.event){
        var e = window.event;
        e.cancelBubble = true;
    }
    var appElement = $("[ng-controller='siteCtrl']");
    var kgrid = $("#grid").data("kendoGrid");
    if (kgrid == null || typeof (kgrid) == "undefined") {
        return;
    }
    var dataedit = kgrid.dataItem($(obj).closest("tr"));
    var scope = angular.element(appElement).scope()
    scope.winDetail.title("人员详情");
    scope.winDetail.refresh({
        url : "persondetail.html?personId=" + dataedit.personId + "&actiontype="+DSJS.ActionType.DELETE
    });
    scope.winDetail.center();
    scope.winDetail.open();
}

// 外部更新
function updategrid() {
    var angularElement = $("[ng-controller='siteCtrl']");
    var scope = angular.element(angularElement).scope();
    scope.readData();
}

// 取消方法--edit--关闭弹出页面
function closeeditWindow() {
    var angularElement = $("[ng-controller='siteCtrl']");
    angular.element(angularElement).scope().winEdit.close();
}
//判断是否去掉字典项请求条件
function isEnumsValid(obj) {
    if (obj) {
        for (var i in obj) {
            if (i && typeof i === "string" && typeof obj[i] === "object") {
                for (var j in obj[i]) {
                    if (j && typeof j === "string" && obj[i][j] && typeof obj[i][j] === "object" &&angular.isArray(obj[i][j]) && obj[i][j].length > 0) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}
