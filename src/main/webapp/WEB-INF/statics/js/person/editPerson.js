//获取到RyId
var id = DSJS.getQueryString("personId");
//获取对应信息
var personInitUrl =  DSJS.getWebRoot()+ "/person/getPersonById";
//保存信息
var savePersonUrl = DSJS.getWebRoot()+ "/person/saveOrUpdatePerson";
//删除单个人员
var deteleUrl = DSJS.getWebRoot()+ "/person/set_person_valid?personid="+id+ "&valid=false";
//获取编辑方式
var actionType =  DSJS.getQueryString("actiontype");
//定义post数据
var queryForm = {
    queryData : {
        personid : id
    }
};
//定义数据格式
var dataStore = new com.dscomm.DataStore();
dataStore.data = {};
dataStore.query.queryForm = queryForm;

//form表单生成需要的字典数据
dataStore.enums = {
    "BASIC_XB" : {key:"",enumItems:[{
        "text": "男",
        "value": "1"
    }, {
        "text": "女",
        "value": "2"
    }]},
};

var myModule=angular.module("myApp", ["kendo.directives","ds.controls"]);
myModule.controller("editorWebCtrl", function ($http, $scope,$timeout) {
    $scope.dataStore = dataStore;
    $scope.jzOrgBoolen = false;

    $("#birthdayPicker").kendoDatePicker({
        format: "yyyy-MM-dd"
    });

    /* $scope.InitOrg=function(){
     console.log("getOrg");
     var serviceRoot = ";

     $http.get(serviceRoot).success(function(data){
     var treeOrgs = new kendo.data.HierarchicalDataSource({
     data:data.data
     });

     $("#orgTree").kendoTreeView({
     dataSource: treeOrgs,
     dataTextField: "text"
     });

     })



     }
     $scope.InitOrg();*/
/*

    $http.get(DSJS.getWebRoot()+ "/demo/getOrgs").success(function (response) {
        $scope.treeData=response.data;
    });
*/


    //初始化函数
    $scope.Init = function() {
        if(actionType==DSJS.ActionType.MODIFY)
        {
            $http.post(personInitUrl,id).success(function(data) {
                if(data.ret == DSJS.ResultStatus.OK && data.data != null){
                    $scope.dataStore.data = data.data;

                    $("#birthdayPicker").kendoDatePicker({
                        value: new Date(data.data.birthday)
                    });

                }else{
                    kendo.alert("错误信息--" + data.msg)
                }

            }).error(function(a, b, c) {
                kendo.alert("获取人员信息失败 " + b);
            });
        }
    };
    //初始化页面
    (function(){
        switch(actionType)
        {
            case DSJS.ActionType.ADD:
                $("#submitbtn").html("新增");
                $scope.Init();
                break;
            case DSJS.ActionType.MODIFY:
                $("#submitbtn").html("编辑");
                $scope.Init();
                break;
            case DSJS.ActionType.DELETE:
                $("#submitbtn").html("删除");
                $("#closeBtn").hide();
                $scope.disabled=true;
                $scope.Init();
                break;
            case DSJS.ActionType.VIEW:
                $("#submitbtn").hide();
                $("#closeBtn").hide();
                $scope.Init();
            default:
                $scope.Init();
                break;
        }

    }());

    //提交数据
    $scope.saveData=function () {
        if(actionType == DSJS.ActionType.ADD || actionType == DSJS.ActionType.MODIFY){
            //下面是编辑/新增数据的操作代码
            if (!$scope.validator.validate()) {
                return false;
            };
            console.log($scope.dataStore.data);
            $scope.dataStore.data.birthday=Date.parse($("#birthdayPicker").data("kendoDatePicker").value());

            $http.post(savePersonUrl,$scope.dataStore.data).success(function(res) {
                if (res.ret == DSJS.ResultStatus.OK) {
                    parent.updategrid();
                    kendo.confirm("成功，是否关闭编辑页?").then(function () {
                        $scope.closeWindow();
                    }, function () {
                        //
                    });

                }else{
                    kendo.alert("错误信息--" + res.msg);
                }

            }).error(function(a, b, c) {
                kendo.alert("失败!" + b);
            });
        }
    };


    //关闭弹出页面
    $scope.closeWindow = function () {
        if(parent.closeeditWindow){
            parent.closeeditWindow();
        }else{
            console.log("cannot find parent");
        }
    };
    $scope.closeDetailWindow = function () {
        if(parent.closeDetailWindow){
            parent.closeDetailWindow();
        }else{
            console.log("cannot find parent");
        }
    };

});
