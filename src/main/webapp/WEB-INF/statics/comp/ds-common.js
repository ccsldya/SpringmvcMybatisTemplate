var NameSpace = new Object();
NameSpace.register = function(path){     
    var arr = path.split(".");     
    var ns = "";     
    for(var i=0;i<arr.length;i++){     
        if(i>0) ns += ".";     
        ns += arr[i];     
        eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");     
    }     
}
//注册命名控件
NameSpace.register("com.dscomm");
com.dscomm.DataStore = function(){
	this.data = new Object();
    this.query = new com.dscomm.Query();
    this.enums = new com.dscomm.Enums();
}
com.dscomm.Query = function () {
    this.pageForm = new com.dscomm.PageForm();
    this.queryForm = new Object();
}
com.dscomm.PageForm = function(){
    this.currentPage = 1;
    this.pageSize = 20;
    this.totalSize = 0;
}

com.dscomm.Enums = function(){

};

com.dscomm.Enum = function()
{
    this.key = "";
    this.enumItems = new Array();
}

com.dscomm.EnumItem = function(){
    this.text = "";
    this.code = "";
}

///DS通用JS类
//立即执行函数写法
///模块化JS设计，避免全局函数名污染
///modify by huangwz 2017.2.15
//在每个JS的开头引用/// <reference path="Common.js" />实现智能提示
///使用方式为DSJS.UrlSearch(),DSJS.flag等等
var DSJS = (function () {
    //var _count = 0;
    /**
    * json格式转树状结构
    * @a	{json}		json数据
    * @idStr	{String}	id的字符串
    * @textStr	{String}	名称的字符串
    * @pidStr	{String}	父id的字符串
    * @chindrenStr	{String}	children的字符串
    * @return	{Array}		数组
    */
    var _transData = function (a, idStr, textStr, pidStr, chindrenStr) {
        var r = [], hash = {}, obj = {}, id = "id", pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (var k = 0; k < len; k++) {
            var tempid = a[k][idStr];//id键值
            var temptext = a[k][textStr];//text键值
            a[k]["id"] = tempid;
            a[k]["text"] = temptext;
        }
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    };
    //url地址参数化
    var _UrlSearch = function () {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;
            }
        }
        return this;
    };
    //根据参数名称获取url地址后的参数值，例如：http://ip:port/abc.html?a=1&b=2
    var _getQueryString=function (queryname) {
        var reg = new RegExp("(^|&)" + queryname + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);

        return null;
    };
    //获取本域顶级window对象
    var _getDomainTop=function () {
        var wnd = window;
        var pwnd = null;

        while(true) {
            try {
                pwnd = wnd.parent;

                if (wnd.location.href == pwnd.location.href) {
                    break;
                }

                if (wnd.location.host != pwnd.location.host) {
                    break;
                }

                var curs = wnd.location.pathname.split("/");
                var pars = pwnd.location.pathname.split("/");
                if (curs[1] != pars[1]) {
                    break;
                }

                wnd = pwnd;
            }
            catch (err) {
                console.log(err);

                break;
            }
        }

        return wnd;
    };
    //获取cookie
    var _getCookie=function (name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=")
            if (c_start != -1) {
                c_start = c_start + name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return "";
    };
    //删除cookie
    var _delCookie=function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
    };
    //设置cookie方法
    var _setCookie=function (key,val,time) {
        if (time == null)
            time = 1;

        var date = new Date(); 		//获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date.toGMTString() + "; path=/";  //设置cookie
    };

    //获取字符串长度（汉字算2个字符）
    var _getTextLength=function (txt) {
        if (typeof(txt) == "undefined" || txt == null || txt == "")
            return 0;

        var len = 0;
        for (var i = 0; i < txt.length; i++) {
            var length = txt.charCodeAt(i);
            if(length >= 0 && length <= 128)
            {
                len += 1;
            }
            else
            {
                len += 2;
            }
        }
        return len;
    };
    //校验字符串长度  minlen:最小长度   maxlen:最大长度
    var _validateTextLength=function (txt, minlen, maxlen) {
        if (typeof(minlen) == "undefined" || isNaN(minlen)) {
            return false;
        }

        if (typeof(maxlen) == "undefined" || isNaN(maxlen)) {
            return false;
        }

        if (minlen < 0) {
            minlen = 0;
        }

        if (minlen > maxlen) {
            return false;
        }

        var len = getTextLength(txt);
        var flag = (len >= minlen && len <= maxlen);
        return flag;
    };
    //时间戳输出为日期时间
    var _getDateFromTimestamp=function (timestamp) {
        if (timestamp == null || timestamp < 0)
            return null;

        var dt = new Date();
        dt.setTime(timestamp);

        return dt;
    };
    /*高亮效果*/
    var _highlight = function (searchText) {
        $('#DetailsTable div').each(function ()//遍历
        {
            $(this).find('.highlight').each(function ()//找到所有highlight属性的元素；
            {
                $(this).replaceWith($(this).html());//将他们的属性去掉；
            });
        });//先清空一下上次高亮显示的内容；
        if (searchText == "") {
            return false;
        }
        var regExp = new RegExp(searchText, 'g');//创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；
        $('#DetailsTable div').each(function ()//遍历文章；
        {
            var html = $(this).html();
            if (html.match(regExp)) {
                console.log(html);
                var newHtml = html.replace(regExp, '<span class="highlight">' + searchText + '</span>');//将找到的关键字替换，加上highlight属性；
                $(this).html(newHtml);//更新文章；
            }
        });
    };
    var _getWebRoot=function () {
            var pathname = window.location.pathname;
            var arr = pathname.split("/");
            var proName = arr[1];
            var webRoot = "/" + proName;

            return webRoot;
    };
    /*清除高亮*/
    var _clearSelection = function () {
        $('#DetailsTable div').each(function ()//遍历
        {
            $(this).find('.highlight').each(function ()//找到所有highlight属性的元素；
            {
                $(this).replaceWith($(this).html());//将他们的属性去掉；
            });
        });
    };
    /*点击别处隐藏下拉控件*/
    var _divup = function (button,control) {
        $(document).bind('click', function (e) {
            var elem = e.target;
            while (elem) {  
                if (elem.id&&elem.id==control.attr("id")||elem.id && elem.id==button.attr("id")) {
                    return;
                }
                elem = elem.parentNode;
            }
            control.slideUp('fast');
        });
    };

    var _actionType = function () {

        return {
            ADD: "add",
            MODIFY: "modify",
            DELETE: "delete",
            VIEW:"view"
        };
    }
    
    var _result = function(){
        return {
            OK:"ok",
            ERROR:"error"
        }
    }
    
    var _alert = function(cont,titl) {
    	if (!titl) {
    		titl = "统一门户";
    	}
    	
    	var id = "ds_div_alert_20170606";
    	var div = $("#" + id, window.document.body);
    	if (div == null || div.length <= 0) {
    		$(_getDomainTop().document.body).append("<div id='" + id + "'></div>");
    		div = $("#" + id, window.document.body);
    	}
    	
    	div.kendoAlert({
            messages:{
                okText: "确定"
            },
            content:cont,
            title:titl,
            closable: true
        }).data("kendoAlert").open();
    }
    
    var _confirm = function(cont, titl, callback) {
    	if (!titl) {
    		titl = "统一门户";
    	}
    	
    	var id = "ds_div_confirm_20170606";
    	var div = $("#" + id, window.document.body);
    	if (div == null || div.length <= 0) {
    		$(_getDomainTop().document.body).append("<div id='" + id + "'></div>");
    		div = $("#" + id, window.document.body);
    	}
    	
    	div.kendoConfirm({
            messages:{
                okText: "确定",
                cancel: "取消"
            },
            content:cont,
            title:titl,
            closable: true
        }).data("kendoConfirm").result.done(callback&&callback());
    }
    
    var _enabled = [
		{"text":"所有","value":""},
		{"text":"启用","value":"1"},
		{"text":"禁用","value":"0"},
	]

    return {
    	Alert:_alert,
    	Confirm:_confirm,
    	ResultStatus:_result(),
        ActionType: _actionType(),
        transData: _transData,
        UrlSearch: _UrlSearch,
        highlight: _highlight,
        clearSelection: _clearSelection,
        DivUp:_divup,
        getWebRoot:_getWebRoot,
        getQueryString:_getQueryString,
        getDomainTop:_getDomainTop,
        getCookie:_getCookie,
        delCookie:_delCookie,
        setCookie:_setCookie,
        getDateFromTimestamp:_getDateFromTimestamp,
        getTextLength:_getTextLength,
        validateTextLength:_validateTextLength,
        Enabled: _enabled
        
    };
})();
//放大模式
var DSJS = (function (mod) {
    //m3
    mod.m3 = function () {
        console.log(11111);
    };
    return mod;
})(DSJS);
//宽放大
var DSJS = (function (mod) {
    return mod;
})(window.DSJS || {});

/**
 * 时间对象的格式化;
 */
Date.prototype.format = function (format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 *删除数组指定下标或指定对象
 */
Array.prototype.remove=function(obj){
    for(var i =0;i <this.length;i++){
        var temp = this[i];
        if(!isNaN(obj)){
            temp=i;
        }
        if(temp == obj){
            for(var j = i;j <this.length;j++){
                this[j]=this[j+1];
            }
            this.length = this.length-1;
        }
    }
};

/**
 * IE8 缺失的一些Javascript函数
 */
//IE8在F12未打开时不支持console
window.console = window.console || (function () {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function () { };
        return c;
})();

//IE8的Array不支持indexOf方法
Array.prototype.indexOf = Array.prototype.indexOf || function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
}

//IE8的String不支持trim方法
String.prototype.trim = String.prototype.trim || function () {
        return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
}




