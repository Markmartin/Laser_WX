

var StatusChangeNotiType={
  //socket连接状态更新
  StatusChangeNotiTypeSocket:'StatusChangeNotiTypeSocket',
  //灯具状态更新
  StatusChangeNotiTypeStatus:'StatusChangeNotiTypeStatus',
  //子设备列表更新
  StatusChangeNotiTypeChildListChange:'StatusChangeNotiTypeChildListChange',
  //
};



function ZADevice(device) {
    if (device != undefined)
    {
        this.timerList = new Array();
        this.open  = true;

        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.bright = 100;
        this.colortemperature = 100;
        this.rgbMode = false;

        if (device == undefined) {
            return;
        }
        // this.connectStatus = ConnectStatusType.ConnectStatusDisConnect;
        if (device.room == undefined)
        {
            this.room = '';
        }else {
            this.room = device.room;
        }

        this.gatewayDevice = device.gatewayDevice;
        this.did = device.did;
        this.host = device.host;
        this.port = device.ws_port;
        //sub_dev
        this.type = device.type;
        this.product_key = device.product_key;
        this.ws_port = device.ws_port;
        this.is_online = device.is_online;
        this.passcode = device.passcode;
        this.dev_alias = device.dev_alias;
        this.sdid = device.sdid;
        this.mac = device.mac;
        this.pk = device.pk;
        // "role": "guest",
        if(device.isGuest != undefined)
        {
            this.isGuest = device.isGuest;

        }
        if(device.role != undefined)
        {
            if (device.role == "owner" || device.role == "special"){
                this.isGuest = false;
            }else {
                this.isGuest = true;
            }
        }
    }
}

    ZADevice.prototype.getHasShareRole = function () {
        return !this.isGuest;
    }

    ZADevice.prototype.getHasAddChildRole = function () {

        if (this.type == 'center_control' && this.isGuest === false)
        {
            return true;
        }
        return false;
    }

    ZADevice.prototype.updateName = function (name,cb) {


    var net = new  Net();
    net.updataDevcieName(name,this.did,cb);


}

//监听状态改变会返回一个参数，参数是改变类型，见StatusChangeNotiType
ZADevice.prototype.setStatusChangeNotify = function setStatusChangeNotify(cb) {
    this.statusChangeNotify = cb;
}

//主动读取设备当前状态
ZADevice.prototype.readStatus = function () {
    var self = this;
    var json = {
        "cmd": "c2s_read",
        "data": {
            "did": self.did,//（目标设备的did）
            // "names": [<str>, <str>, …] （变长数据点可选参数：传入需要读取的数据点名称，参数省略表示读取全部数据点；定长数据点读操作忽略该参数）
        }
    }
    this.sendJson(json);
}


//设备控制
ZADevice.prototype.openORclose = function openORclose(open) {
    this.open = open;
    this.c2s_write({
        "S": open
    });
}


//亮度控制
ZADevice.prototype.brightChange = function brightChange(val) {
    this.bright = val;
    this.c2s_write({
        "W": val
    });
}

//色温控制
ZADevice.prototype.ctChange = function ctChange(val) {
    this.colortemperature = val;
    this.c2s_write({
        "Y": val
    });
}

ZADevice.prototype.staticChange = function (bright,ct) {
    this.bright = bright ;
    this.colortemperature = ct;
    this.c2s_write({
        "W": bright,
        "Y": ct
    });
}

//颜色控制
ZADevice.prototype.colorChange = function colorChange(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.c2s_write({
        "R": r,
        "G": g,
        "B": b
    });
}


//添加设备，第一个参数为回调， 回调的第一个参数为是否成功，第二参数为添加的子设备对象（只有成功的时候有），
ZADevice.prototype.addChildDevice = function addChildDevice(cb) {
    console.log('添加子设备');
    // var de = this;
    // utils = new Utils();
    // var raw = utils.Str2Bytes('00000003080000930000003856') ;
    // de.c2s_raw(raw);
    // this.addChildDeviceCallBack = function(success) {
    //     if (success != true) {
    //        cb(false,undefined);
    //     }else{
    //        cb(true,undefined);
    //     }
    // };
    //
    //
    // return;


    if(this.getHasAddChildRole() == false)
    {
        console.log('该网关没有添加子设备的权限');
        return;
    }

    var de = this;
    var hasCallBack = false;
    //第三步收到回调之后获取新设备列表
    this.changeChildDeviceCallBack = function (newDeivces) {
        console.log('添加本地之后的子设备的个数：' + newDeivces.length);
        diffDeviceArray = de.comparisonData(oldDevices, newDeivces);

        if (diffDeviceArray.length != 0) {
            // console.log('查询到的新设备：' + diffDevice.did + '\n mac :' + diffDevice.mac + '\n pk:' + diffDevice.pk);
            for (var i = 0; i < diffDeviceArray.length; i++) {
                diffDevice = diffDeviceArray[i];

                console.log('查询到的新设备：' + diffDevice.did + '\n mac :' + diffDevice.mac + '\n pk:' + diffDevice.pk);
                var net = new Net();
                net.bindDevice(diffDevice.pk, diffDevice.mac, '灯具-'+diffDevice.mac, function (data) {
                    console.log('添加绑定设备云端回调：' + JSON.stringify(data));

                });
            }
            cb(true, diffDeviceArray);
            hasCallBack = true;
            this.changeChildDeviceCallBack = undefined;
            // var net = new Net();
            // net.bindDevice(diffDevice.pk,diffDevice.mac,'设备',function(data){
            //   console.log('添加绑定设备云端回调：' + JSON.stringify(data));
            //   cb(true,diffDevice);
            //   hasCallBack = true;
            //   this.changeChildDeviceCallBack = undefined;
            // });
        } else {
            console.log('未查询到的新设备');
            if (hasCallBack != true) {
                cb(false, undefined);
                this.changeChildDeviceCallBack = undefined;
                hasCallBack = true;
            }
        }


    }
    this.addChildDeviceCallBack = function (success) {
        if (success != true) {

            cb(false, undefined);
            this.changeChildDeviceCallBack = undefined;
            hasCallBack = true;
        } else {
            //  cb(true,undefined);
        }

    };
    //第一步获取老的子设备列表
    de.getChildDevice(function (devices) {
        oldDevices = devices;
        console.log('添加之前的子设备的个数：' + oldDevices.length);
        utils = new Utils();
        //第二步获取设备列表成功之后发送添加指令
        var raw = utils.Str2Bytes('00000003080000930000003856');
        de.c2s_raw(raw);
    });


    // setTimeout(function() {
    //   if(hasCallBack == false)
    //   {
    //     //添加设备超时
    //     console.log('添加设备超时');
    //       hasCallBack = true;
    //       cb(false,undefined);
    //
    //
    //   }
    // },30000);

}

ZADevice.prototype.getChildDevice = function getChildDevice(cb) {
    console.log('获取子设备');
    this.getChildDeviceCallBack = cb;
    utils = new Utils();
    var raw = utils.Str2Bytes('0000000308000093000000065a')
    this.c2s_raw(raw);

}
// **********************************   连接设备的方法 一般不需要主动调用  *****************

//第一个参数子设备的sdid ,第二个参数did， 第三个参数是回调，回调的参数是true或false
ZADevice.prototype.deleteChildDevice = function deleteChildDevice(sdid, did, cb) {
    console.log('删除子设备sdid:' + sdid + '   did:' + did);

    if(this.getHasAddChildRole() == false)
    {
        console.log('网关没有添加子设备的权限，就直接解除绑定')
        //网关没有添加子设备的权限，就直接解除绑定
        var net = Net();
        net.unBindDevice(did, function (success,eve) {
            if (success == true)
            {
                var success1 =  eve.success.length > 0 ? true : false;
                console.log('删除云端子设备回调:' + JSON.stringify(eve) + '  success :' + success);
                hasCallBack = true;
                cb(success1);
            }else
            {
                cb(success);
            }

        });

        return;
    }


    self = this;
    var hasCallBack = false;
    this.deleteChildDeviceCallBack = function (status) {
        //删除本地子设备回调
        console.log('删除本地子设备回调' + status);

        if (status != true) {
            hasCallBack = true;
            cb(false);
            return;
        }
        //第二步收到本地删除回调
        var net = Net();
        net.unBindDevice(did, function (success,eve) {
            if(success == true)
            {
                var success1 =  eve.success.length > 0 ? true : false;
                console.log('删除云端子设备回调:' + JSON.stringify(eve) + '  success :' + success);
                hasCallBack = true;
                cb(success1);

            }else
            {
                cb(success);

            }

        });
    };
    //第一步删除本地
    var utils = new Utils();
    var raw = utils.Str2Bytes('000000030c0000930000003658' + sdid)

    self.c2s_raw(raw);


    // setTimeout(function() {
    //   if(hasCallBack == false)
    //   {
    //     //删除设备超时
    //     console.log('删除设备超时');
    //      cb(false);
    //       hasCallBack = true;
    //
    //   }
    // },30000);
}



// ********************* 发送指令与解析的方法一般不需要外部调用  *********************

//控制数据发送 例： {"S": open}
ZADevice.prototype.c2s_write = function c2s_write(data) {
    console.log('控制数据发送：', JSON.stringify(data));

    // var websocketInstance = websocketInstance.getInstance();
    var websocketInstance = GetWebSocketInstance();
    websocketInstance.wirteAttribute(this,data);


}

//二进制数据透传
ZADevice.prototype.c2s_raw = function c2s_raw(raw) {
    console.log('数据透传内容：', raw);
    var websocketInstance = GetWebSocketInstance();
    websocketInstance.wirteRaw(this,raw);

}

ZADevice.prototype.sendJson = function (json) {

    var websocketInstance = GetWebSocketInstance();
    websocketInstance.sendJson(this,json);

}




ZADevice.prototype.comparisonData = function comparisonData(oldDevices, newDevices) {
    var diffDeviceArray = new Array();
    for (var i = 0; i < newDevices.length; i++) {
        newDevice = newDevices[i];
        has = false;
        for (var j = 0; j < oldDevices.length; j++) {
            oldDevice = oldDevices[j];
            if (oldDevice.mac == newDevice.mac) {
                has = true;
            }
        }
        if (!has) {
            diffDeviceArray.push(newDevice);
            // diffDevice = newDevice;
            console.log('发现新设备' + newDevice.mac);
            break;
        }
    }

    return diffDeviceArray;
}


ZADevice.prototype.statusChangeNotifyWithType = function statusChangeNotifyWithType(notiType) {

    if (this.statusChangeNotify != undefined) {
        this.statusChangeNotify(notiType, this);
    }
}

//古月-定时

//获取定时列表 cb(参数一:状态值 参数二:responseObject)
ZADevice.prototype.getTimerList = function getTimerList(cb) {
    var net = new Net();
    var self = this;
    var url="/app/devices/"+this.did+"/scheduler";
    var finalCB = function (status,responseObject) {
        if (status == true)
        {
            self.timerList.splice(0,self.timerList.length);
            for (var  index in responseObject)
            {
                var timer = new Timer(responseObject[index]);
                // self.deleteTimer(timer.id,function () {
                //
                // });
                self.timerList.push(timer);
            }
        }
        cb(status,responseObject);
    }
    net.GizwitsOpenAPI(url,"GET",{},finalCB);
}




//创建一次性定时任务 date为当前日期(new Date()设置hour和min为UI所选) deviceState设备状态  cb回调  weekdays[0-6]的数组代表周一到周日
ZADevice.prototype.setTimer  = function setTimer(repeat,date,deviceState,cb,weakadys)
{
    this.setUnifiedTimer(true,repeat,date,deviceState,cb,weakadys);

}

//场景添加定时
ZADevice.prototype.setModelTimer  = function setModelTimer(repeat,date,deviceState,cb,weakadys)
{
    this.setUnifiedTimer(false,repeat,date,deviceState,cb,weakadys);
}

//获取添加定时参数JSON
ZADevice.getModelTimerJSON  = function getModelTimerJSON(repeat,date,deviceState,weakadys)
{
    // ZADevice.setUnifiedTimer(false,repeat,date,deviceState,cb,weakadys);
    var params ;
    if(repeat == false) {
        params = ZADevice.timerParams(repeat,true,deviceState,date);
    }else {
        params = ZADevice.timerParams(repeat,true,deviceState,date,weakadys);
    }
    params.remark = false;

    return JSON.stringify(params);
}


//统一定时接口
ZADevice.prototype.setUnifiedTimer = function (singleTimer,repeat,date,deviceState,cb,weakadys) {
    var url="/app/devices/"+this.did+"/scheduler";
    var params ;
    if(repeat == false) {
        params = ZADevice.timerParams(repeat,true,deviceState,date);
    }else {
        params = ZADevice.timerParams(repeat,true,deviceState,date,weakadys);
    }
    params.remark = singleTimer;
    var net = new  Net();
    net.GizwitsOpenAPI(url,"POST",params,cb);
}

//timerState 定时器是开是关  timerObject 定时器对象  cb回调
ZADevice.prototype.switchTimer = function switchTimer(timerState,timerObject,cb) {
    var url="/app/devices/"+this.did+"/scheduler/"+timerObject.id;
    var params = {
        "attrs": timerObject.attrs,
        "time": timerObject.time,
        "repeat": timerObject.repeat,
        "enabled": timerState
    }
    if (timerObject.repeat == "none")
    {
        // params.date = timerObject.date;
        var date = new Date();
        var now =  new Date();

        if ( timerObject.localhour < now.getHours() ){
            date=new Date(date.getTime()+24*60*60*1000);
        }else if (timerObject.localhour == now.getHours()){
            if (timerObject.localmin<= now.getMinutes()){
                date=new Date(date.getTime()+24*60*60*1000);
            }
        }

        params.date =  date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

    }



    var net = new Net();
    net.GizwitsOpenAPI(url,"PUT",params,cb);
}

//timerID 定时器ID  repeat是否重复 timerState 定时器是否开关  deviceState 设备状态 date为当前日期(new Date()设置hour和min为UI所选)
//cb 回调   weekdays[0-6]的数组代表周一到周日
ZADevice.prototype.changeTimerState = function changeTimerState(timerID,repeat,timerState,deviceState,date,cb,weekdays)
{
    var url="/app/devices/"+this.did+"/scheduler/"+timerID;
    var params ;
    if (repeat == false)
    {
        params =  ZADevice.timerParams(repeat,timerState,deviceState,date);
    }
    else
    {
        params =  ZADevice.timerParams(repeat,timerState,deviceState,date,weekdays);
    }
    var net = new Net();
    net.GizwitsOpenAPI(url,"PUT",params,cb);
}

//timerID 定时器ID  cb回调
ZADevice.prototype.deleteTimer = function deleteTimer(timerID,cb)
{
    var url="/app/devices/"+this.did+"/scheduler/"+timerID;
    var net = new Net();
    net.GizwitsOpenAPI(url,"DELETE",{},cb);
}


ZADevice.timerParams = function timerParams(repeat,timerState,deviceState,date,weekdays)
{
    var params;
    if (repeat == false )
    {
        var now =  new Date();
        if (date.getHours()< now.getHours()){
            date=new Date(date.getTime()+24*60*60*1000);
        }else if (date.getHours() == now.getHours()){
            if (date.getMinutes()<= now.getMinutes()){
                date=new Date(date.getTime()+24*60*60*1000);
            }
        }
        var utcMonth=appendZero(date.getUTCMonth()+1);
        var utcDay=appendZero(date.getUTCDate());
        var utcHour=appendZero(date.getUTCHours());
        var utcMin=appendZero(date.getUTCMinutes());
        var utcDate=date.getUTCFullYear()+"-"+utcMonth+"-"+utcDay;
        var utcTime=utcHour+":"+utcMin;
        params={
            "attrs": {
                "S":deviceState
            },
            "date": utcDate,
            "time": utcTime,
            "repeat": "none",
            "enabled": timerState
        };
    }
    else
    {
        if (date.getUTCHours()>date.getHours()){
            for (var i=0;i<weekdays.length;i++){
                if (weekdays[i]==0){
                    weekdays[i]=6;
                }else {
                    weekdays[i]-=1;
                }
            }
        }

        var week = ['mon','tue','wed','thu','fri','sat','sun'];
        var  weeks = new Array();
        for (var index in weekdays)
        {
            weeks.push(week[weekdays[index]]);
        }
        var utcHour=appendZero(date.getUTCHours());
        var utcMin=appendZero(date.getUTCMinutes());
        var utcTime=utcHour+":"+utcMin;
        params={
            "attrs": {
                "S":deviceState
            },
            "time": utcTime,
            "repeat": weeks.join(","),
            "enabled": timerState
        }
    }
    return params;
}

function appendZero(num) {
    return num<10?"0"+num:num;
}

