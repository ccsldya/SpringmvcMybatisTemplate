/**
 * Created by Administrator on 2017/3/30.
 */
if(typeof(dsNgApp)==="undefined")
    dsNgApp= angular.module("ds.controls", []);

dsNgApp
    .directive('dsMutilChoicePerson',function () {
        return {
        /*    scope:{
                selected:'@'
            },*/
            restrict : 'AE',
            replace : false,
            transclude:true,
            controller:function ($scope,$attrs) {
                $scope.ClickM=function (name) {
                    $scope.newwindow.title("多项选择");
                    $scope.newwindow.refresh({
                        height:"525px",
                        url: DSJS.getWebRoot()+"/resources/comp/ds-mutil-choice-person/ds-mutil-choice-person-template.html?name="+name,
                        iframe: true
                    });
                    $scope.newwindow.center().open();
                };
                $scope.CloseM=function (name) {
                    $scope[name]="";
                    var _ids=name+"ids";
                    $scope[_ids]="";
                }
            },
            template: function(tElement,tAttrs){
                var name=tAttrs.dsChoicePersonName;
                var _html = '<div>'+
                    '<div class="input-group">'+
                    '<input type="text" class="form-control" ng-model="'+name+'" readonly>'+
                    '<input type="hidden" ng-model="'+name+'ids">'+
                    '<div class="input-group-btn">'+
                    '<button type="button" class="btn btn-default" ng-click="ClickM(\''+name+'\')"><span class="k-sprite k-icon k-edit"></span>添加人员</button>'+
                    '<button type="button" class="btn btn-default" ng-click="CloseM(\''+name+'\')"><span class="k-sprite k-icon k-i-delete"></span></button>'+
                    '</div>'+
                    '</div>'+
                    '<div kendo-window="newwindow" k-title="\'新建\'"'+
                    'k-width="800" k-height="525" k-visible="false" k-modal="true"'+
                    'k-on-open="newwindowvisible = true" k-on-close="newwindowvisible = false"></div>';
                return _html;
            }
        }
    })
    .factory('dsMutilChoicePersonService',["$http",function($http){
    var selectedPerson = function(modeName, selecteddata){
        var angularElement = window.parent.$("body");
        var ids="",names="";
        for(var i=0;i<selecteddata.length;i++){
            ids+=selecteddata[i].id+",";
            names+=selecteddata[i].text+",";
        }
        ids=ids.substring(0,ids.length-1);
        names=names.substring(0,names.length-1);
        var _ids=Request["name"]+"ids";
        window.parent.angular.element(angularElement).scope()[_ids]=ids;
        window.parent.angular.element(angularElement).scope()[Request["name"]]=names;
        window.parent.angular.element(angularElement).scope().newwindow.close();
    };
    var CloseWindow=function () {
        var angularElement = window.parent.$("body");
        window.parent.angular.element(angularElement).scope().newwindow.close();
    }
    var Init = function(modeName,scope)
    {
        var angularElement = window.parent.$("body");
        var ids="",names="";
        var _ids=modeName+"ids";
        ids = window.parent.angular.element(angularElement).scope()[_ids];
        if(ids==undefined||ids==""||ids==null)
            return;
        names = window.parent.angular.element(angularElement).scope()[modeName];
        var _idsArray = ids.split(',');

        var _namesArray = names.split(',');
        var _json=new Array();
        for(var i=0;i<_idsArray.length;i++){
            console.log(_idsArray[i]);
            var arr=
            {
                id:_idsArray[i],
                text:_namesArray[i]
            };
            _json.push(arr);
        }
        scope.selectedPersonList=_json;

    }
    return { Init:Init,selectedPerson:selectedPerson,CloseWindow:CloseWindow};
    }
]);