/**
 * Created by Administrator on 2017/3/30.
 */
if(typeof(dsNgApp)==="undefined")
    dsNgApp= angular.module("ds.controls", []);
dsNgApp.directive('dsSingleChoicePerson',function () {
        return {
            restrict : 'AE',
            replace : false,
            transclude:true,
            controller:function ($scope,$attrs) {
                $scope.ClickS=function (name) {
                    $scope.newwindow.title("单项选择");
                    $scope.newwindow.refresh({
                        height:"510px",
                        url: DSJS.getWebRoot()+"/resources/comp/ds-single-choice-person/ds-single-choice-person-template.html?name="+name,
                        iframe: true
                    });
                    $scope.newwindow.center().open();
                };
                $scope.CloseS=function (name) {
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
                    '<button type="button" class="btn btn-default" ng-click="ClickS(\''+name+'\')"><span class="k-sprite k-icon k-edit"></span>添加人员</button>'+
                    '<button type="button" class="btn btn-default" ng-click="CloseS(\''+name+'\')"><span class="k-sprite k-icon k-i-delete"></span></button>'+
                    '</div>'+
                    '</div>'+
                    '<div kendo-window="newwindow" k-title="\'新建\'"'+
                    'k-width="800" k-height="525" k-visible="false" k-modal="true"'+
                    'k-on-open="newwindowvisible = true" k-on-close="newwindowvisible = false"></div>';
                return _html;
            }
        }
    })
    .factory('dsSingleChoicePersonService',["$http",function($http){
        var selectedPerson = function(modeName, selecteddata){
            console.log(JSON.stringify(selecteddata));
            var angularElement = window.parent.$("body");
            var _ids=Request["name"]+"ids";
            window.parent.angular.element(angularElement).scope()[_ids]=selecteddata.id;
            window.parent.angular.element(angularElement).scope()[Request["name"]]=selecteddata.text;
            window.parent.angular.element(angularElement).scope().newwindow.close();
        };
        return {selectedPerson:selectedPerson};
    }
]);