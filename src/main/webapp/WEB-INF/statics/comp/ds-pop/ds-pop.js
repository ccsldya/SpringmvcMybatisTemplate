/**
 * Created by Administrator on 2017/4/5.
 */
if(typeof(dsNgApp)==="undefined")
    dsNgApp= angular.module("ds.controls", []);

dsNgApp
    .directive('dsPop',function () {
        return {
            restrict : 'AE',
            replace : false,
            transclude:true,
            controller:function ($scope,$attrs) {
                $scope.ClickP=function (name) {
                    $scope.newwindow.title("Pop标题");
                    $scope.newwindow.refresh({
                        height:"525px",
                        url: "popcontent.html?name="+name,
                        iframe: true
                    });
                    $scope.newwindow.center().open();
                };
            },
            template: function(tElement,tAttrs){
                var name=tAttrs.dsPopName;
                var _html = '<div>'+
                    '<div class="input-group">'+
                    '<input type="text" class="form-control" ng-model="'+name+'">'+
                    '<input type="hidden" ng-model="'+name+'ids">'+
                    '<div class="input-group-btn">'+
                    '<button type="button" class="btn btn-default" ng-click="ClickP(\''+name+'\')"><span class="k-sprite k-icon k-edit"></span></button>'+
                    '</div>'+
                    '</div>'+
                    '<div kendo-window="newwindow" k-title="\'新建\'"'+
                    'k-width="800" k-height="525" k-visible="false" k-modal="true"'+
                    'k-on-open="newwindowvisible = true" k-on-close="newwindowvisible = false"></div>';
                return _html;
            }
        }
    })
    .factory('dsPopService',["$http",function($http){
        var save=function (val) {
            var angularElement = window.parent.$("body");
            window.parent.angular.element(angularElement).scope()[Request["name"]]=val;
            window.parent.angular.element(angularElement).scope().newwindow.close();
        }
        return { save:save};
    }
    ]);