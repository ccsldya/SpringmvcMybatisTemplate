if(typeof(dsNgApp)==="undefined")
    dsNgApp= angular.module("ds.controls", []);

dsNgApp
    .directive('dsUpload',function () {
        return {
            restrict : 'AE',
            replace : false,
            transclude:true,
            controller:function ($scope,$http,$attrs) {
                var _id=$attrs.dsUpload;
                var initdata={
                    "authority":"3",
                    "attachments":[ ]
                }
                loadAttachments(_id, initdata);
            },
            template: function(tElement,tAttrs){
                var _id=tAttrs.dsUpload;
                var _html = '<div id="'+_id+'" class="attachment"></div>'+
                        '<div id="'+_id+'window"></div>';
                return _html;
            },
            scope : {
                methods:"=dsUpload"
            },
            compile:function (tele, tattrs) {
                return {
                    pre: function($scope, ele, attrs){
                        var _id=attrs.dsUpload;
                        //控件方法集
                        $scope.methods={
                            //dataSource:{},
                            //初始化数据加载
                            setdata:function (data) {
                                loadAttachments(_id, data);
                            }
                        };
                    },
                    post: function($scope, ele, attrs){

                    }
                }
            }
        }
    });