/**
 * Created by Administrator on 2017/3/24.
 */
var Request=DSJS.UrlSearch();
// var angularElement = window.parent.$("body");
// var selectedpeople;
// if(top != self&&window.parent.angular.element(angularElement).scope()[Request["name"]+'ids']!=undefined) {
//     selectedpeople=JSON.parse(window.parent.angular.element(angularElement).scope()[Request["name"]+'json']);
//     console.log(selectedpeople);
// }
angular.module("EnumDemo", [ "kendo.directives","ds.controls" ])
    .controller("EnumDemo.Ctrl",['$scope','$http','dsMutilChoicePersonService', function($scope,$http,dsMutilChoicePersonService){
        //初始化类型
        $scope.selectedPersonList=new Array();
        $scope.personList=new Array();
        dsMutilChoicePersonService.Init(Request["name"],$scope);
        var orgurl = DSJS.getWebRoot() + "/demo/getOrgs?showall=false&r=" + Math.random();
        $http.get(orgurl).success(function(res){
            if(res.ret=="ok"&&res.dataStore!=undefined){
                $scope.treeData = new kendo.data.HierarchicalDataSource({
                    data:res.dataStore
                });
            }else{
                //console.log("data error");
            }
        }).error(function (a,b,c) {
            //console.log("ajax error");
        });
        $scope.treeOption ={
            dragAndDrop:false ,
            expandAll:false
        };
        $scope.click = function(dataItem) {
            console.log(dataItem);
            //请求人员
            var personurl = DSJS.getWebRoot() + "/v1/person/get_persons_byorgid?orgid=" + dataItem.id + "&r=" + Math.random();
            $http.get(personurl).success(function(res){
                if(res!=undefined&&res!=null&&res!=""&&res.dataStore!=undefined){
                    var list=res.dataStore;
                    //检查下已选择的人员ID
                    for(var i=0; i<$scope.selectedPersonList.length; i++)
                    {
                        for(var j=0;j<list.length;j++){
                            if(list[j].id==$scope.selectedPersonList[i].id){
                                list.remove(j);
                            }
                        }
                    }
                    $scope.personList=list;
                }else{
                    $scope.personList=[];
                }
            }).error(function (e) {
                console.log(e);
            });
        };
        $scope.SearchPerson = function() {
            if($.trim($("#ry_txt").val())==""){
                return;
            }
            //请求人员
            var personurl = DSJS.getWebRoot() + "/v1/person/get_persons_bypyt?pyt=" + $.trim($("#ry_txt").val()) + "&r=" + Math.random();
            $http.get(personurl).success(function(res){
                if(res!=undefined&&res!=null&&res!=""&&res.dataStore!=undefined){
                    var list=res.dataStore;
                    //检查下已选择的人员ID
                    for(var i=0; i<$scope.selectedPersonList.length; i++)
                    {
                        for(var j=0;j<list.length;j++){
                            if(list[j].id==$scope.selectedPersonList[i].id){
                                list.remove(j);
                            }
                        }
                    }
                    $scope.personList=list;
                }else{
                    $scope.personList=[];
                }
            }).error(function (e) {
                console.log(e);
            });
        };
        $scope.clickItemFun = function(index){
            //检查是否存在指定id
            for(var j=0; j<$scope.selectedPersonList.length; j++){
                if($scope.selectedPersonList[j].id!=undefined&&$scope.selectedPersonList[j].id==$scope.personList[index].id){
                    return;
                }
            }
            $scope.selectedPersonList.push($scope.personList[index]);
            $scope.personList.remove(index);
        };

        $scope.unselectedItemFun = function(index){
            //检查是否存在指定id
            for(var j=0; j<$scope.personList.length; j++){
                if($scope.personList[j].id!=undefined&&$scope.personList[j].id==$scope.selectedPersonList[index].id){
                    return;
                }
            }
            $scope.personList.push($scope.selectedPersonList[index]);
            $scope.selectedPersonList.remove(index);
        };
        $scope.SaveData=function () {
            //$scope.selectedpeoplelist即可
             dsMutilChoicePersonService.selectedPerson(Request["name"],$scope.selectedPersonList);
            // if(top== self) {
            //     console.log($scope.selectedPersonList);
            // }else{
            //     // var angularElement = window.parent.$("body");
            //     // var _ids=Request["name"]+"ids";
            //     // window.parent.angular.element(angularElement).scope()[_ids]=ids;
            //     // window.parent.angular.element(angularElement).scope()[Request["name"]]=names;
            //     // window.parent.angular.element(angularElement).scope().newwindow.close();
            // }
        };
        $scope.Cancel=function () {
            dsMutilChoicePersonService.CloseWindow();
        };

    }])