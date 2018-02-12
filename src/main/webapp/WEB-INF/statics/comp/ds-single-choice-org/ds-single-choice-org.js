/**
 * Created by Administrator on 2017/3/30.
 */
///去除ds的驼峰名
function clearDSCamelName(name) {
    if(name.length>2 && name.substring(0,2)=='ds'){
        var clearName=name.substring(2);
        if(clearName.length>1){
            var realName=clearName.substring(0,1).toLowerCase()+clearName.substring(1);
            return realName;
        }else {
            var realName=clearName.substring(0,1).toLowerCase();
            return realName;
        }
    }else{
        return name;
    }
}

function  forEachHierarchicalData(hierSource,matchFiled,findvalueArray) {
    var alldatas= hierSource.data();
    var result=[];
    if(alldatas){
    	if(findvalueArray.length==1&&findvalueArray[0]=="true"){
    		findvalueArray[0] = alldatas[0].id
    	}
        for(var n=0;n<alldatas.length;n++) {
            var matchVal = alldatas[n][matchFiled];
            for (var i = 0; i < findvalueArray.length; i++) {
                if (matchVal == findvalueArray[i]) {
                    result.push(alldatas[n]);
                }
            }
            alldatas[n].load();
            if (alldatas[n].hasChildren) {
                var r = forHierarchicalChildren(alldatas[n].children.data(), matchFiled, findvalueArray);
                result = result.concat(r);
            }
        }
    }else {
        return result;
    }

    return result;
}
function forHierarchicalChildren(children,matchFiled,findvalueArray) {
    var result=[];
    try {
        var alldatas = children;

        if (alldatas.length>0) {
            for (var n = 0; n < alldatas.length; n++) {
                var matchVal = alldatas[n][matchFiled];
                for (var i = 0; i < findvalueArray.length; i++) {
                    if (matchVal == findvalueArray[i]) {
                        result.push(alldatas[n]);
                    }
                }
                alldatas[n].load();
                if (alldatas[n].hasChildren) {
                    var r = forHierarchicalChildren(alldatas[n].children.data(), matchFiled, findvalueArray);
                    result = result.concat(r);
                }
            }
        } else {
            return result;
        }
    }
    catch (ex) {

    }
    return result;
}
if(typeof(dsNgApp)==="undefined")
    dsNgApp= angular.module("ds.controls", ["kendo.directives"]);

dsNgApp
    .directive('dsSingleChoiceOrg',function () {
        return {
            restrict : 'AE',
            replace : false,
            template: '<span class="k-dropdown-wrap k-state-default ">' +
            '<input type="text" class="k-input k-valid" role="combobox" ng-model="selectText" readonly>' +
            '<span tabindex="-1" class="k-select" role="button" aria-label="select" unselectable="on"  ng-click="btnDown()">' +
            '<span class="k-icon k-i-arrow-s" aria-label="select" unselectable="on"></span>' +
            '</span>' +
            '<div class="ds-combo-tree k-valid">' +
            '<div kendo-tree-view="dsTreeView"' +
            'k-options="options" ' +
            'k-data-source="dsDataSource" ' +
            'k-on-check="onCheck(kendoEvent)" ' +
            'k-on-select="onSelect(kendoEvent)" ' +
            '></div>' +
            '</div></span>',

            scope : {
                // dsModel: "=",
                dsChoiceOrgIds:"=",
                dsOptions: "=",
                //dsDataSource: "=",
                dsValuePrimitive: "=",
                dsDataValueField: "=",
                dsDataTextField: "=",
                //dsAutoClose:"=",
                methods:"=dsChoiceOrg",
                dsOnCheck: "&",
                dsOnSelect: "&",
            },
            controller:function ($scope,$http) {
                //var url=DSJS.getWebRoot()+"/resources/comp/ds-single-choice-org/org.json";
                var url = DSJS.getWebRoot() + "/v1/org/get_orgs_tree?showall=false&r=" + Math.random();
                $http.get(url).success(function (response) {
                	if (response.ret == "ok") {
                		$scope.dsDataSource=new kendo.data.HierarchicalDataSource({
                			data: response.dataStore
                		});
                	}
                });
                $scope.dsAutoClose=true;
            },
            compile:function (tele, tattrs) {
                return {
                    pre: function($scope, ele, attrs){
                        var tree = ele.find('.k-dropdown-wrap > div.ds-combo-tree').first();
                        $scope.selectItems=[];
                        $scope.selectText='';
                        //配置选项集
                        $scope.options = {
                            valuePrimitive: false,
                            checkboxes: false,
                            dataSource: {},
                            dataTextField: 'text',
                            dataValueField: 'id',
                            autoClose:true
                        };

                        //控件方法集
                        $scope.methods={
                            //通过值来选择项
                            selectValue:function (val) {
                                var vals=[];
                                var result=[];
                                if(angular.isArray(val)){
                                    vals=val;
                                }
                                else {
                                    vals.push(val);
                                }
                                result= forEachHierarchicalData($scope.dsTreeView.dataSource,$scope.options.dataValueField,vals);

                                if(result.length>0){
                                    angular.forEach(result,function (data) {
                                        if($scope.options.checkboxes){
                                            var node= $scope.dsTreeView.findByUid(data.uid);
                                            var eventarg={node: node};
                                            var dataitem= $scope.dsTreeView.dataItem(node);
                                            dataitem.checked=true;
                                            node.find('input[type="checkbox"]').first().attr('checked',true);
                                            $scope.dsTreeView.trigger('check',eventarg);
                                        }
                                        else {
                                            var node= $scope.dsTreeView.findByUid(data.uid);
                                            $scope.dsTreeView.select(node);
                                            var eventarg={node: node};
                                            $scope.dsTreeView.trigger('select',eventarg);
                                            return;
                                        }
                                    });
                                }

                            },
                            //将node转换为dataItem;
                            dataItem:function (node) {
                                return $scope.dsTreeView.dataItem(node);
                            },
                            //查询txt的节点(node)
                            findByText:function (text) {
                                return $scope.dsTreeView.findByText(text);
                            },
                            //展开指定节点
                            expand:function (nodes) {
                                return $scope.dsTreeView.expand(nodes);
                            },
                            //展开指定值的数组
                            expandPath:function (valArray) {
                                $scope.dsTreeView.dataSource.fetch ({schema:{model:{id:$scope.options.dataValueField}}});
                                return $scope.dsTreeView.expandPath(valArray);
                            },
                            //显示下拉树
                            opend:function () {
                                tree.show();
                            },
                        };

                        if ($scope.dsOptions) {
                            $scope.options = angular.extend($scope.options, $scope.dsOptions);//合并选项
                        }
                        //遍历scope内部ds指令（dsOptions除外），将其赋值到scope.options
                        angular.forEach($scope, function (val, key) {
                            try {
                                if (key.substring(0, 2) == 'ds'
                                    && key.substring(0, 4) != 'dsOn'
                                    && key != 'dsOptions') {
                                    if ($scope[key]) {
                                        var variaName = clearDSCamelName(key);//option中的字段是不包含ds开头的，则需要去除
                                        $scope.options[variaName] = val;//将存在的属性值赋值到options中177 $scope.options[datasource]=treeData2
                                        
                                    }
                                }
                            } catch (ex) {
                            }

                        });

                        $scope.onCheck = function (e) {
                            var nodeDataItem = $scope.dsTreeView.dataItem(e.node);
                            if (nodeDataItem.checked) {
                                if($scope.selectText==''){
                                    //$scope.selectText=angular.element(e.node).text().trim();
                                    $scope.selectText=nodeDataItem[$scope.options.dataTextField];
                                }
                                else{
                                    $scope.selectText+=','+nodeDataItem[$scope.options.dataTextField];
                                }
                            }
                            else {
                                var val =','+ $scope.selectText;
                                val = val.replace(',' + nodeDataItem[$scope.options.dataTextField], '');
                                if (val.substring(0, 1) == ',') {
                                    val=val.substring(1, val.length);
                                }
                                $scope.selectText=val;
                            }
                            setValue(nodeDataItem,nodeDataItem.checked);
                            //如果dsAutoClose为true则选择项后隐藏树视图
                            if($scope.dsAutoClose==true){
                                tree.hide();
                            }
                            $scope.dsOnCheck({dsEvent: {node: e.node, dataItem: nodeDataItem}});//触发绑定的事件指令
                        };
                        $scope.onSelect = function (e) {
                            var nodeDataItem = $scope.dsTreeView.dataItem(e.node);
                            if(!$scope.options.checkboxes) {
                                $scope.selectText = nodeDataItem[$scope.options.dataTextField];
                                setValue(nodeDataItem,true);
                            }
                            //如果dsAutoClose为true则选择项后隐藏树视图
                            if($scope.dsAutoClose==true){
                                tree.hide();
                            }
                            $scope.dsOnSelect({dsEvent: {node: e.node, dataItem: nodeDataItem}});//触发绑定的事件指令
                        };
                        function setValue(data,isAdd) {
                            //绑定值
                            if(isAdd){
                                if($scope.options.checkboxes){
                                    $scope.selectItems.push(data);
                                }
                                else {
                                    $scope.selectItems.splice(0,$scope.selectItems.length);
                                    $scope.selectItems.push(data);
                                }
                            }
                            else {
                                for (var i=0;i<$scope.selectItems.length;i++){
                                    if($scope.selectItems[i]==data){
                                        $scope.selectItems.splice(i,1);
                                        break;
                                    }
                                }
                            }
                            if ($scope.options.valuePrimitive) {
                                var str='';
                                console.log($scope.selectItems);
                                for (var i=0;i<$scope.selectItems.length;i++){
                                    if(str==''){
                                        str+=$scope.selectItems[i][$scope.options.dataValueField];
                                    }
                                    else{
                                        str+=','+$scope.selectItems[i][$scope.options.dataValueField];
                                    }
                                }
                                //$scope.dsModel=str;
                                var ids="";
                                var sel=$scope.selectItems;
                                for(var i=0;i<sel.length;i++){

                                    ids+=sel[i]["id"]+",";
                                }
                                ids=ids.substring(0,ids.length-1);
                                $scope.dsChoiceOrgIds=ids;
                            }
                            else {
                                //$scope.dsModel=$scope.selectItems;
                                var ids="";
                                var sel=$scope.selectItems;
                                for(var i=0;i<sel.length;i++){

                                    ids+=sel[i]["id"]+",";
                                }
                                ids=ids.substring(0,ids.length-1);
                                $scope.dsChoiceOrgIds=ids;
                                //$scope.dsModel=angular.copy($scope.selectItems);
                            }
                        };
                    },
                    post: function($scope, ele, attrs){
                        ele.addClass('k-widget k-combobox k-header k-combobox-clearable k-invalid');
                        var tree = ele.find('.k-dropdown-wrap > div.ds-combo-tree').first();
                        var txt = ele.find('.k-dropdown-wrap> input[role="combobox"]').first();
                        var downbtn = ele.find('.k-dropdown-wrap > span[role="button"]').first();
                        txt.height(txt.height()-0.5);
                        ele.mouseover(function () {
                            ele.children('.k-state-default').addClass('k-state-hover');
                        });
                        ele.mouseout(function () {
                            ele.children('.k-state-default').removeClass('k-state-hover');
                        });
                        //下拉按扭点击事件
                        $scope.btnDown=function () {
                            if (tree.is(':visible')) {
                                tree.hide();
                            } else {
                                tree.show();
                                tree.offset({top: ele.offset().top + ele.height() , left: ele.offset().left});
                            }
                        };
                        downbtn.focusout(function () {//该事件是为了解决谷歌、火狐不能用tree.focus()获取焦点，导致树视图失去焦点不隐藏的问题
                            if (!tree.is(':hover')) {
                                tree.hide();
                            }
                        });
                        //树视图失去焦点事件
                        tree.focusout(function (e) {
                            if (!$(this).is(':hover')) {
                                $(this).hide();
                            }
                        });
                    }
                }
            }
        }
    });