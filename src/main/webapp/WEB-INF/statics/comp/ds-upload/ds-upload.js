/**
 * Created by Administrator on 2017/5/3.
 */
//附件文件类型定义
var _attachmentFileTypes = [ { //图片
    fmt : "image",
    img : "icon-file-picture",
    exts : [ "jpg", "bmp", "png", "gif" ]
}, { //word文档
    fmt : "word",
    img : "icon-file-word",
    exts : [ "doc", "docx" ]
}, { //excel文档
    fmt : "excel",
    img : "icon-file-excel",
    exts : [ "xls", "xlsx" ]
}, { //ppt文档
    fmt : "powerpoint",
    img : "icon-ppt",
    exts : [ "ppt", "pptx" ]
}, { //viso文档
    fmt : "visio",
    img : "icon-other-file",
    exts : [ "vsd", "vsdx", "vsdm", "vdx" ]
}, { //压缩文档
    fmt : "archive",
    img : "icon-file-zip",
    exts : [ "rar", "zip", "gz", "7z" ]
}, { //文本
    fmt : "text",
    img : "icon-txt",
    exts : [ "txt", "htm", "html", "css", "js", "json", "xml", "log" ]
}, { //pdf
    fmt : "pdf",
    img : "icon-file-pdf",
    exts : [ "pdf" ]
}, { //音频
    fmt : "audio",
    img : "icon-file-music",
    exts : [ "wav", "mp3" ]
}, { //视频
    fmt : "vedio",
    img : "icon-file-play",
    exts : [ "avi", "mp4", "mkv", "mpg" ]
} ];
var FuncName="";
var _attachmentChangedFunc = null;
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
                };
                loadAttachments(_id, initdata);
                $scope.$watch('dsModel',function(){
                    if($scope.dsModel!=undefined&&$scope.dsModel!=null&&$scope.dsModel!="") {
                        $scope.methods.setdata($scope.dsModel);
                        console.log($attrs.dsCallback);
                        FuncName=$attrs.dsCallback;
                    }
                });
            },
            template: function(tElement,tAttrs){
                var _id=tAttrs.dsUpload;
                var _html = '<div id="'+_id+'" class="attachment"></div>'+
                    '<div id="'+_id+'window"></div>';
                return _html;
            },
            scope : {
                dsModel: "=",
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
// var uploadurl=DSJS.getWebRoot() + "/task/addfiles";
// var delurl=DSJS.getWebRoot() + "/task/delfile";
function callFunction(functionName){
    //初始化this.func属性,
    this.func = function(id,status){};
    try{
        //这里用eval方法，把我们传进来的这个方法名所代表的方法当作一个对象来    赋值给callFunction的func属性。
        this.func = eval(functionName);
    }catch(e){
        alert("找不到"+functionName+"()这个方法");
    }
}
//从文件名获取文件类型（格式）
function getAttachmentFileTypeFormat(filename) {
    var fmt = "other";

    if (filename == null || filename == "")
        return fmt;

    var pos = filename.lastIndexOf(".");
    if (pos > 0) {
        var ext = filename.substring(pos + 1).toLocaleLowerCase();

        var i = 0, j = 0;
        for (i = 0; i < _attachmentFileTypes.length; i++) {
            var ftyp = _attachmentFileTypes[i];

            for (j = 0; j < ftyp.exts.length; j ++) {
                if (ftyp.exts[j] == ext) {
                    return ftyp.fmt;
                }
            }
        }
    }

    return fmt;
}

//获取附件格式对应的png名称
function getAttachmentFileTypeImageFrFormat(fmt) {
    if (fmt == null || fmt == "")
        return "icon-file-other";

    var i = 0;
    for (i = 0; i < _attachmentFileTypes.length; i++) {
        if (_attachmentFileTypes[i].fmt == fmt) {
            return _attachmentFileTypes[i].img;
        }
    }

    return "icon-other-file";
}

//从文件名获取文件类型（格式）对应的png名称
function getAttachmentFileTypeImageFrFileName(filename) {
    if (filename == null || filename == "")
        return "icon-other-file";

    var pos = filename.lastIndexOf(".");
    if (pos > 0) {
        var ext = filename.substring(pos + 1).toLocaleLowerCase();

        var i = 0, j = 0;
        for (i = 0; i < _attachmentFileTypes.length; i++) {
            var ftyp = _attachmentFileTypes[i];

            for (j = 0; j < ftyp.exts.length; j ++) {
                if (ftyp.exts[j] == ext) {
                    return ftyp.img;
                }
            }
        }
    }

    return "icon-other-file";
}

/**
 * 附件jason对象
 {
     authority:"0",
     attachments:[
         {
             id:"附件ID（唯一标识）1",
             fileName:"附件名称1",
             url:"附件下载url",
             authority:"0"
         },
         {
             id:"附件ID（唯一标识）2",
             fileName:"附件名称2",
             url:"附件下载url",
             authority:"1"
         }
     ]
 }

 * 外层的authority:
 * "3":组件右上方显示“添加、删除、下载”按钮
 * "2":组件右上方显示“添加、下载”按钮
 * "1":组件右上方显示“删除、下载”按钮
 * "其它值":组件右上方只显示“下载”按钮
 *
 * attachments[i].authority"
 * "0":附件图标下方只显示“下载”按钮
 * "1":附件图标下方显示“下载、删除”按钮
 */



//初始化附件div
function initAttachmentsDiv(divid) {

    if (divid == null || divid == "")
        return;

    var atmobj = $("#" + divid);
    if (atmobj.length <= 0)
        return;

    if (atmobj.find("#table_atmHeader_" + divid).length <= 0) {
        var headerhtml = '';
        // headerhtml += '<table id="table_atmHeader_' + divid + '" style="width:100%; margin-bottom:5px;">';
        // headerhtml += '<tr>';
        // headerhtml += '<td style="width:auto;">&nbsp</td>';
        // headerhtml += '<td id="td_atmHeader_' + divid + '" class="attachmentHeader">';
        //
        // headerhtml += '  ';
        //
        // headerhtml += '</td>';
        // headerhtml += '</tr>';
        // headerhtml += '</table>';
        headerhtml+='<div id="table_atmHeader_' + divid + '" class="ds-panel">';
        headerhtml+='<div class="ds-panel-header" style=" display: table;width: 100%;"><div class="col-sm-2"><span class="k-button-icon icon-upload"></span>附件</div><div id="td_atmHeader_' + divid + '" class="text-right"></div></div>';
        headerhtml+='<div class="ds-panel-content">';
        if (atmobj.find("#div_atmBody_" + divid).length <= 0) {
            var bodyhtml = '<div id="div_atmBody_' + divid + '"  class="attachmentBody container-fluid"></div>';
            headerhtml+=bodyhtml;
        }
        headerhtml+='</div>';

        atmobj.append(headerhtml);
    }


}

//加载附件数据  divid:显示附件的div控件ID, daturl:附件数据url或附件数据对象
function loadAttachments(divid, daturl) {
    initAttachmentsDiv(divid);

    //  "/ds-coc-task-web/task/addfiles"	//上传文件的url地址

    if (divid == null || divid == "" || daturl == null)
        return;

    if ((typeof daturl == 'string') /*&& daturl.constructor == String*/) {          //  daturl是字符串
        $.get(daturl, function (data) {
            addAttachmentsToDom(divid, data);
        });
    } else if ((typeof daturl == 'object') /*&& daturl.constructor == Object*/) {   //  dataurl是对象
        addAttachmentsToDom(divid, daturl);
    }
}

//获取当前所有附件列表  divid:显示附件的div控件ID
function getAttachments(divid) {
    if (divid == null || divid == "")
        return null;

    var $objs = $("#" + divid).find(".atmItemSize");
    if ($objs == null || $objs.length <= 0)
        return null;

    var atms = [];
    var i = 0;
    for (i = 0; i < $objs.length; i++) {
        var ops = $($objs[i]).attr("data-options");
        if (ops == null || ops == "")
            continue;

        var atmobj = null;
        try {
            atmobj = eval("({" + ops + "})");
        }
        catch (err) {
            console.log("attachmentList.getAttachments(" + divid + ") error: " + err);
            atmobj = null;
        }

        if (atmobj != null)
            atms.push(atmobj);
    }

    return atms;
}

//把json对象数据添加到dom中
function addAttachmentsToDom(divid, dat) {
    $("#td_atmHeader_" + divid).html("");
    if (divid == null || divid == "" || dat == null)
        return;
    if (dat.authority == "3") {     //可添加、删除
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-add icon-attach" onclick="addAttachment(\'' + divid + '\')"></span></div>');
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-bin icon-attach" onclick="batchRemoveAttachments(\'' + divid + '\')"></span></div> ');
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-download icon-attach" onclick="batchDownloadAttachments(\'' + divid + '\')"></span></div>');
    }
    else if (dat.authority == "2") {//可添加
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-add icon-attach" onclick="addAttachment(\'' + divid + '\')"></span></div>');
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-bin icon-attach" onclick="batchRemoveAttachments(\'' + divid + '\')"></span></div>');
    }
    else if (dat.authority == "1") {//可删除
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-add icon-attach" onclick="addAttachment(\'' + divid + '\')"></span></div>');
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-download icon-attach" onclick="batchDownloadAttachments(\'' + divid + '\')"></span></div>');
    }
    else {
        //只可下载
        $("#td_atmHeader_" + divid).append('<div class="ds-panel-tool"><span class="k-button-icon icon-download icon-attach" onclick="batchDownloadAttachments(\'' + divid + '\')"></span></div>');
     }
    if (dat.attachments != null && dat.attachments.length > 0) {
        var i = 0;
        for (i = 0; i < dat.attachments.length; i++) {
            addAttachmentItem2(divid, dat.attachments[i]);
        }
    }
}

//鼠标移动到附件div上
function attachItemMouseHover(obj) {
    if ($(obj).hasClass("atmItemBakSelect") == false) {
        if ($(obj).hasClass("atmItemBakNormal"))
            $(obj).removeClass("atmItemBakNormal");
        if ($(obj).hasClass("atmItemBakHover") == false)
            $(obj).addClass("atmItemBakHover");
    }
    $(obj).find(".atmItemFooter").show();
    $(obj).find(".atmItemName").hide();
}

//鼠标从附件div上移走
function attachItemMouseLeave(obj) {

    if ($(".atmItemBody", $(obj)).hasClass("atmItemBakSelect") == false) {
        if ($(".atmItemBody", $(obj)).hasClass("atmItemBakHover"))
            $(".atmItemBody", $(obj)).removeClass("atmItemBakHover");
        if ($(".atmItemBody", $(obj)).hasClass("atmItemBakNormal") == false)
            $(".atmItemBody", $(obj)).addClass("atmItemBakNormal");
    }

    $(obj).find(".atmItemFooter").hide();
    $(obj).find(".atmItemName").show();
}

//单击附件div
function attachItemClick(obj) {
    if ($(obj).hasClass("atmItemBakSelect")) {
        $(obj).removeClass("atmItemBakSelect");
        $(obj).addClass("atmItemBakNormal");
        $(obj).find(".atmItemTip").hide();
    } else {
        $(obj).removeClass("atmItemBakNormal");
        $(obj).addClass("atmItemBakSelect");
        $(obj).find(".atmItemTip").show();
    }

}

//删除一个附件
function removeAttachment(attachid, name, divobj) {
    FuncName=$(divobj).parents("[ds-upload]").attr("ds-callback");
    kendo.confirm("确定要删除附件“" + name + "”吗？").then(function () {
        if (divobj == null)
            return;

        //$(divobj).parents(".atmItemSize").remove();

        deleteAttachItem(attachid,name,$(divobj).parents(".atmItemSize"));
        if (_attachmentChangedFunc != null){
            _attachmentChangedFunc();
        }
        if(FuncName!=null){
            //初始化this.func属性,
            var test = new callFunction(FuncName);
            test.func(attachid,"delete");
        }
    }, function () {
        return;
    });
}

//从后台和界面删除一个附件 attachid：附件ID，name：附件名称，target：附件在界面dom中的jQuery对象
function deleteAttachItem(attachid,name,target) {
    if (attachid == null || attachid == "") {
        return;
    }

    if (target != null) {
        target.remove();	//从dom中删除附件
    }

    //var delurl = "?id=" + attachid + "&r=" + Math.random();

    //先post到后台，从服务端删除附件；删除成功后再从界面删除
    // $.ajax({
    //     url:delurl,
    //     type:"DELETE",
    //     dataType:"json",
    //     success:function(data) {
    //         if (data.ret == "ok") {
    //             if (target != null)
    //                 target.remove();	//从dom中删除附件
    //         }
    //         else {
    //             var msg = "删除附件失败";
    //             if(name != null && name != "")
    //                 msg = "删除附件“" + name + "”失败";
    //             if (data.msg != null && data.msg != "")
    //                 msg += "：" + data.msg;
    //             kendo.alert(msg);
    //         }
    //     },
    //     error:function(a,b,c) {
    //         var msg = "删除附件失败！";
    //         if(name != null && name != "")
    //             msg = "删除附件“" + name + "”失败！";
    //         kendo.alert(msg);
    //     }
    // });
}

//批量删除多个附件
function batchRemoveAttachments(divid) {
    FuncName=$("[ds-upload='"+divid+"']").attr("ds-callback");
    var selItems = getSelectedAttachments(divid, 1);
    if (selItems == null || selItems.length <= 0) {
        kendo.alert("请先选择至少一个需要删除的附件！");
        return;
    }

    kendo.confirm("确定要删除" + selItems.length + "个附件吗？").then(function () {
        var i = 0;
        for (i = 0; i < selItems.length; i++) {
            if (selItems[i].obj != null && selItems[i].target != null &&
                selItems[i].obj.id != null && selItems[i].obj.id != "") {
                deleteAttachItem(selItems[i].obj.id, selItems[i].obj.fileName,
                    $(selItems[i].target));
            }
        }

        if (_attachmentChangedFunc != null) {
            _attachmentChangedFunc();
        }
        if(FuncName!=null){
            //初始化this.func属性,
            var test = new callFunction(FuncName);
            test.func(divid,"delete");
        }
    }, function () {
        return;
    });
}

//下载一个附件
function downloadAttatchment(url) {
    window.open(url);
}

//批量下载多个附件
function batchDownloadAttachments(divid) {
    var selItems = getSelectedAttachments(divid, 0);
    if (selItems == null || selItems.length <= 0) {
        kendo.alert("请先选择至少一个需要下载的附件！");
        return;
    }

    var i = 0;
    for (i = 0; i < selItems.length; i++) {
        if (selItems[i].obj != null && selItems[i].obj.url != null && selItems[i].obj.url != "")
            window.open(selItems[i].obj.url);
    }
}

//打开添加附件模态对话框
function addAttachment(divid) {

    popupUploadDlg(divid);
}

//获取选中的附件
function getSelectedAttachments(divid, flag) {
    if (divid == null || divid == "")
        return null;

    if (flag != 1)	//flag: 0-可下载  1-可删除
        flag = 0;

    var $objs = $("#" + divid).find(".atmItemBakSelect");
    if ($objs == null || $objs.length <= 0)
        return null;

    var atms = [];
    var i = 0;
    for (i = 0; i < $objs.length; i++) {
        var $target = $($objs[i]).parent();
        var ops = $target.attr("data-options");
        if (ops == null || ops == "")
            continue;

        var atmobj = null;
        try {
            atmobj = eval("({" + ops + "})");
        }
        catch (err) {
            console.log("attachmentList.getAttachments(" + divid + ") error: " + err);
            atmobj = null;
        }

        if (atmobj != null) {
            if (flag == 0 || (flag == 1 && atmobj.authority == "1"))
                atms.push({obj:atmobj,target:$target});
        }

    }

    return atms;

}

//计算附件显示水平间距
function getAttachmentItemHorSpace(divid) {
    if (divid == null || divid == "")
        return 10;

    var w = $("#" + divid).width();
    var n = Math.floor((w - 12.0) / 130.0);
    var s = Math.floor((w - 120 * n -2) / (n + 1));   //附件Item间距

    if (s < 0 || s == Infinity || s == -Infinity) {
        s = 10;
    }

    return s;
}

function addAttachmentItem2(divid, item) {
    if (divid == null || divid == "" || item == null)
        return;

    if (typeof(item.type) == "undefined" || item.type == null) {
        item.type = getAttachmentFileTypeFormat(item.fileName);
    }

    if (typeof(item.authority) == "undefined" || item.authority == null) {
        item.authority = "0";
    }

    var s = getAttachmentItemHorSpace(divid);	//水平间距

    var itemhtml = "";
    itemhtml += '<div style="margin-left:' + s + 'px;" class="atmItemSize" onmouseleave="attachItemMouseLeave(this)"';
    itemhtml += ' data-options="id:\'' + item.id + '\',fileName:\'' + item.fileName + '\',url:\'' + item.url + '\',authority:\'' + item.authority + '\'">';
    itemhtml += '<div class="atmItemBody atmItemBakNormal"  onmouseover="attachItemMouseHover(this)"  onclick="attachItemClick(this)">';
    itemhtml+='<div class="atmItemTip" style="display: none;"><span class="k-button-icon icon-confirm"></span></div>';
    itemhtml += '<div class="atmItemIcon">';
    //itemhtml += '<img alt="fmt" src="' + DSJS.getWebRoot() + '/resources/comp/ds-upload/image/' + getAttachmentFileTypeImageFrFormat(item.type) + '" class="atmItemIconSize" />';
    itemhtml+='<span class="'+getAttachmentFileTypeImageFrFormat(item.type) +'" style="font-size: 48px;color: #1fd0a3;"></span>';
    itemhtml += '</div>';
    itemhtml += '<div class="atmItemName">' + item.fileName + '</div>';
    itemhtml += '<div class="atmItemFooter" style="display: none;" >';
    if (item.authority == "1") {
        itemhtml += '<div title="下载" class="atmItemFooterBtn atmItemFooterLeftBtn" style="width:52px;" onclick="downloadAttatchment(\'' + item.url + '\')">';
        itemhtml += '<span class="k-button-icon icon-download"></span>';
        itemhtml += '</div>';
        itemhtml += '<div title="删除" class="atmItemFooterBtn atmItemFooterRightBtn" style="width:52px;" onclick="removeAttachment(\'' + item.id + '\', \'' + item.fileName + '\', this)">';
        itemhtml += '<span class="k-button-icon icon-bin"></span>';
        itemhtml += '</div>';
    } else {
        itemhtml += '<div title="下载" class="atmItemFooterBtn atmItemFooterLeftBtn" style="width:104px;" onclick="downloadAttatchment(\'' + item.url + '\')">';
        itemhtml += '<span class="k-button-icon icon-download"></span>';
        itemhtml += '</div>';
    }
    itemhtml+='</div></div>';

    var items = $("#div_atmBody_" + divid + " .atmItemSize");
    if (items.length <= 0)
        $("#div_atmBody_" + divid).prepend(itemhtml);
    else
        items.last().after(itemhtml);

    $("#div_atmBody_" + divid).mCustomScrollbar({theme:"minimal-dark"});

}

//向dom添加一个附件
function addAttachmentItem(divid, item) {
    addAttachmentItem2(divid, item);

    if (_attachmentChangedFunc != null){
        _attachmentChangedFunc();
    }
}


var _divPopDlg = "";        //window.top中弹出窗口的div层id
var _ifrmUpload = "";       //上传附件iframe控件id和name

//弹出模态对话框
function popupUploadDlg(divid) {

    // var divDlg = $("#" + _divPopDlg);
    // if (divDlg.length <= 0) {
    //
    //     var cdt = new Date();
    //     _divPopDlg = "divUploadModal_" + cdt.getHours() + "" + cdt.getMinutes() + "" + cdt.getSeconds() + "" + cdt.getMilliseconds();
    //     _ifrmUpload = "ifrmUploadAttach_" + cdt.getHours() + "" + cdt.getMinutes() + "" + cdt.getSeconds() + "" + cdt.getMilliseconds();
    //
    //     var html = "";
    //
    //     html += '<div id="' + _divPopDlg + '" class="modal fade in" role="dialog" aria-hidden="true">';
    //
    //     html += '<div class="modal-dialog" style="width:700px;">';
    //
    //     html += '<div class="modal-content">';
    //
    //     html += '<div class="modal-header">';
    //     html += '<span class="glyphicon glyphicon-remove" style="color:red;cursor:pointer;float:right;font-size:20px;" title="关闭" data-dismiss="modal" aria-hidden="true"></span>';
    //     html += '<span class="glyphicon glyphicon-upload" style="font-size:16px;"></span>';
    //     html += '<span class="modal-title" style="font-size:16px; font-weight:bold;">上传附件</span>';
    //     html += '</div>';
    //
    //     html += '<div class="modal-body" style="width:100%; height:400px; overflow: hidden;">';
    //     html += '<iframe id="' + _ifrmUpload + '" name="' + _ifrmUpload + '" src="" style="width:100%; height:100%; border: none;"></iframe>';
    //     html += '</div>';
    //
    //     html += '</div>';
    //
    //     html += '</div>';
    //
    //     html += '</div>';
    //
    //     $(window.document.body).append(html);
    // }

    var mysrc = DSJS.getWebRoot() + '/resources/comp/ds-upload/uploadAttachment.html?atmdiv=' + divid + '&r=' + Math.random();
    // $("#" + _ifrmUpload).attr("src", mysrc);
    //
    // $("#" + _divPopDlg).modal("show");
    $("#"+divid+"window").kendoWindow({
        width: "715px",
        height:"360px",
        title: "附件",
        content: mysrc,
        iframe: true
    }).data("kendoWindow").center().open();

}
function CloseWindow(divid) {
    $("#"+divid+"window").data("kendoWindow").close();
}
$(function () {
    $(".ds-panel-content").mCustomScrollbar({theme:"minimal-dark"});
});