function Utils()
{
    return {
      bytes2int:bytes2int,
      bytes2string:bytes2string,
      Str2Bytes:Str2Bytes,
      hexCharCodeToStr:hexCharCodeToStr,
      Bytes2Str:Bytes2Str,
    }
}

function bytes2int(bytes,index,count)
{
  var tmp1 =0x00 ;
  for(var i=index; i<index+count; i++)
  {
     var tmp = bytes[i] << ((index+count-1-i)*8);
     tmp1 += tmp;
  }
  return tmp1;
}

function bytes2string(bytes,index,count)
{

  var str = "";
  var tag = index+count;
  tag = (tag > bytes.length )? bytes.length:tag;
  for(var i=index; i<tag; i++)
  {
    if(i>bytes.length){
      break;
    }

     var tmp = bytes[i].toString(16);
     if(tmp.length == 1)
     {
         tmp = "0" + tmp;
     }
     str += tmp;
  }
  return str;

}

//字符串转数组
function Str2Bytes(str)
{
    var pos = 0;
    var len = str.length;
    if(len %2 != 0)
    {
       return null;
    }
    len /= 2;
    var hexA = new Array();
    for(var i=0; i<len; i++)
    {
       var s = str.substr(pos, 2);
       var v = parseInt(s, 16);
       hexA.push(v);
       pos += 2;
    }
    return hexA;
}

function hexCharCodeToStr(hexCharCodeStr) {

  //  console.log('hexCharCodeStr:'+ hexCharCodeStr + '长度'+hexCharCodeStr.length);
　　var trimedStr = hexCharCodeStr.trim();
　　var rawStr =
　　trimedStr.substr(0,2).toLowerCase() === "0x"
　　?
　　trimedStr.substr(2)
　　:
　　trimedStr;
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
　　　　alert("Illegal Format ASCII Code!");
　　　　return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
  // console.log('解码过的 hexCharCodeStr:'+resultStr + '长度'+hexCharCodeStr.length);
　　return resultStr.join("");
}

//字节数组转十六进制字符串
function Bytes2Str(arr)
{
    var str = "";
    for(var i=0; i<arr.length; i++)
    {
       var tmp = arr[i].toString(16);
       if(tmp.length == 1)
       {
           tmp = "0" + tmp;
       }
       str += tmp;
    }
    return str;
}

function getQueryStringOfStr(name,str) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r =str.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}




function Format(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

// “yyyy-MM-dd HH:MM:SS”

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds()+"   " + date.getMilliseconds();
    return currentdate;
}