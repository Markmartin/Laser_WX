//websocket 具体实现


var ConnectStatusType = {
    //socket连接状态更新
    ConnectStatusConnect: 'ConnectStatusConnect',
    ConnectStatusDisConnect: 'ConnectStatusDisConnect',
    ConnectStatusConnectError: 'ConnectStatusConnectError',

};


function SocketClient(device) {
    this.host = device.host;
    this.port = device.port;
    // this.type = device.type;
    // this.conntetType =  ((device.type == 'center_control') ? 'custom':'attrs_v4' );
    this.deviceArray = new Array();
    this.deviceArray.push(device);
    this.jsonArray = new Array();
    //已经登录
    this.isLogin = false;
    //正在连接中，
    this.inConnect = false;
    //正在登陆中
    this.inLogin = false;
}


//第一步开启socket,在socket连接上之后会登录
SocketClient.prototype.connectAndLogin = function connectAndLogin(socketCB, loginCB) {

    var self = this;
    this.connect(function (status) {
        if (socketCB != undefined) {
            socketCB(status);
        }

        if (status == ConnectStatusType.ConnectStatusConnect) {
            self.socketLogin(loginCB);
        }
    });
}

//开启socket
SocketClient.prototype.connect = function connect(cb) {
    var self = this;
    var url = `ws://${this.host}:${this.port}/ws/app/v1`
    console.log('开启socket：' + url);
    // var  websocket = sock
    var websocket = new WebSocket(url);
    self.inConnect = true;
    websocket.onopen = function (evt) {
        console.log('socket连接成功');
        self.inConnect = false;
        cb(ConnectStatusType.ConnectStatusConnect);
        // self.isLogin = false;
        self.connectStatus = ConnectStatusType.ConnectStatusConnect;
        // self.statusChangeNotifyWithType(StatusChangeNotiType.StatusChangeNotiTypeSocket);
    };
    websocket.onclose = function (evt) {
        console.log('socket 关闭');
        self.isLogin = false;
        self.inConnect = false;
        self.connectStatus = ConnectStatusType.ConnectStatusDisConnect;
        cb(ConnectStatusType.ConnectStatusDisConnect);
        // self.statusChangeNotifyWithType(StatusChangeNotiType.StatusChangeNotiTypeSocket);
    };
    websocket.onmessage = function (evt) {
        //收到消息
        self.webSocketOnGetMessage(evt)
    };
    websocket.onerror = function (evt) {
        console.log('收到Socket错误消息' + evt);
        self.isLogin = false;
        self.inConnect = false;
        self.connectStatus = ConnectStatusType.ConnectStatusDisConnect;
        cb(ConnectStatusType.ConnectStatusConnectError);
        // self.statusChangeNotifyWithType(StatusChangeNotiType.StatusChangeNotiTypeSocket);
    };
    self.websocket = websocket;

}
//第二步，拿上uid，token登录
SocketClient.prototype.socketLogin = function socketLogin(cb) {
    this.loginSuccessCallBack = cb
    _uid = getUid();
    _token = getToken();


    var conn = this;
    var type = this.type;
    var config = new Config();
    // var type = this.config.commType;
    console.log('设备登录' + config.gizwitsAppId + '\n_uid：' + _uid + '\n_token：' + _token + '\ntype:' + type);
    var json = {
        cmd: "login_req",
        data: {
            appid: config.gizwitsAppId,
            uid: _uid,
            token: _token,
            p0_type: type,
            heartbeat_interval: config.heartbeat_interval
        }
    };
    conn.sendJson(json);
}

// ********************* 发送指令与解析的方法一般不需要外部调用  *********************


//控制数据发送 例： {"S": open}
SocketClient.prototype.c2s_write = function c2s_write(device, data) {
    console.log('控制数据发送：', JSON.stringify(data));
    var self = this;
    var json = {
        "cmd": "c2s_write",
        "data": {
            "did": device.did,
            "attrs": data,
        }
    };
    this.sendJson(json);
}

//二进制数据透传
SocketClient.prototype.c2s_raw = function c2s_raw(device, raw) {
    console.log('数据透传内容：', raw);
    var self = this;
    var json = {
        cmd: "c2s_raw",
        data: {
            did: device.did,
            raw: raw
        }
    };
    this.sendJson(json);
}


//发送json数据
SocketClient.prototype.sendJson = function sendJson(json) {
    var self = this;
    var websocket = this.websocket;

    if (json.cmd == 'login_req' && self.inLogin) {
        // self.jsonArray.push(data);
        return;
    }
    if (json.cmd == 'login_req') {
        self.inLogin = true;
    } else {
        var has = false;
        for (var index  in self.jsonArray) {
            if (json == self.jsonArray[index]) {
                has = true;
                break;
            }
        }
        if (has == false) {
            self.jsonArray.push(json);
        }
    }
    if (self.inConnect) {
        return;
    }
    if (websocket != undefined && websocket.readyState == websocket.OPEN && (self.isLogin == true || (json.cmd == 'login_req'))) {
        if (json.cmd == 'login_req') {
            var data = JSON.stringify(json);
            websocket.send(data);
            console.log(" 发出去的json：" + getNowFormatDate());
            console.log(data);
            var net = Net();
            net.log('', data, '发送 - 登录');
            return;
        }
        var selfIndex = 0;
        for (var index in self.jsonArray) {
            setTimeout(function () {
                var data1 = self.jsonArray[0];
                var data = JSON.stringify(data1);
                websocket.send(data);
                console.log(" 发出去的json：" + getNowFormatDate());
                console.log(data);
                var net = Net();
                net.log('', data, '发送 - 控制');

                self.jsonArray.splice(0, 1);
                selfIndex = selfIndex + 1;
            }, index * 500)
            // console.log( " 发出去的json：" + data);
        }
        return true
    } else {
        if (websocket == undefined || websocket.readyState != websocket.OPEN) {
            console.log("websocket 没有打开");
            self.connectAndLogin(function (status) {
            }, function (status) {
                if (status == true) {
                    self.sendJson(json);
                    return;
                }
            });
        } else {
            console.log("没有登录");
            self.socketLogin(function (status) {
                if (status == true) {
                    self.sendJson(json);
                }
            });
        }
        return false
    }
}

// ********************* 以下方法外部不要调用  *********************

//收到消息回调
SocketClient.prototype.webSocketOnGetMessage = function webSocketOnGetMessage(evt) {
    console.log('Socket收到消息：' + getNowFormatDate() + evt.data);
    console.log(evt);

    var res = JSON.parse(evt.data);

    //发送日志给卓年后台
    receiveDataLog(res.cmd, res);


    var cmd = res.cmd;
    var data = res.data;
    var notiType;
    var self = this;


    if (cmd == 'pong') {
        console.log('收到心跳消息');
        // console.log( evt);
        return;
    }
    var did;
    if (data.did != undefined) {
        did = data.did.split('/')[0];
    }


    switch (cmd) {
        case 'login_res': {
            self.inLogin = false;
            self.isLogin = data.success;
            if (self.loginSuccessCallBack != undefined) {
                self.loginSuccessCallBack((this.isLogin));
            }

            console.log('did ：' + data.did + '  收到登录回调：' + data.success);
            var config = new Config();

            window.setInterval(function () {
                //100s发送一个心跳
                var json = {
                    "cmd": "ping"
                }
                self.sendJson(json);
            }, (config.heartbeat_interval / 2) * 1000);
        }
            break;
        case 's2c_noti': {
            var device;
            for (var index in self.deviceArray) {
                var de = self.deviceArray[index];
                if (did == de.did) {
                    device = de;
                    break;
                }

            }
            if (device != undefined) {
                notiType = StatusChangeNotiType.StatusChangeNotiTypeStatus;
                attrs = res.data.attrs;
                device.open = attrs.S;
                device.r = attrs.R;
                device.g = attrs.G;
                device.b = attrs.B;
                device.bright = attrs.W;
                device.colortemperature = attrs.Y;
                device.rgbMode = attrs.rgbMode;
                console.log('状态变化通知  名字：' + device.dev_alias + ':' + device.did + '   r :' + device.r + '  g:' + device.g + '  b:' + device.b + ' bright:' + device.bright + '  colortemperature:' + device.colortemperature);

                device.statusChangeNotifyWithType(notiType);
            }

            break;
        }
        case 's2c_raw': {
            self.dealRaw(did, data.raw);
        }
            break;
        case 's2c_invalid_msg': {
            //错误信息，目前断开socket
            // self.websocket.close();
        }
            break;
        case 's2c_binding_changed': {
            //
            var bindStatus = data.bind;
            if (bindStatus == false) {

            }
        }
    }
}
//二进制文件处理
SocketClient.prototype.dealRaw = function dealRaw(did, raw) {
    var index = -1;
    var str;
    var self = this;
    var utils = new Utils();
    console.log('did ：' + did + '收到设备消息长度：' + raw.length + '  内容：' + utils.bytes2string(raw, 0, raw.length));

    var device;
    for (var index in self.deviceArray) {
        var de = self.deviceArray[index];
        if (did == de.did) {
            device = de;
            break;
        }
    }

    if (device == undefined) {
        return;
    }

    for (var i = 0; i < raw.length - 2; i++) {
        str = utils.bytes2string(raw, i, 3);
        // console.log('收到设备消息遍历关键字：' + str);
        if (str == '000094' || str == '000091') {
            index = i + 2;
            if (str == '000094') {

                sn = utils.bytes2int(raw, index + 1, 4);
                action = raw[index + 5];
                index = index + 6;
            } else {

                action = raw[index + 1];
                index = index + 2;
            }

            console.log('收到子设备消息:' + str + '   action :' + utils.bytes2string(raw, index - 1, 1) + '   长度：' + raw.length);

            if (action == 0x5b || action == 0x5c) {
                var childDeviceArray = self.parseChildDevice(raw, index);
                if (str == '000094') {
                    if (device.getChildDeviceCallBack != undefined) {
                        device.getChildDeviceCallBack(childDeviceArray);
                    }
                    console.log('获取子设备列表反馈，收到的子设备个数：' + childDeviceArray.length);
                } else {
                    if (device.changeChildDeviceCallBack != undefined) {
                        device.changeChildDeviceCallBack(childDeviceArray);
                    }
                    console.log('更新子设备列表反馈，收到的子设备个数：' + childDeviceArray.length);
                }

            }
            if (action == 0x57) {
                var success = raw[index];
                success = (success == 0x00 ? true : false);
                console.log('收到添加子设备反馈:' + success);
                if (device.addChildDeviceCallBack != undefined) {
                    device.addChildDeviceCallBack(success);
                }
            }
            if (action == 0x59) {
                var success = raw[index];
                success = (success == 0x00 ? true : false);
                console.log('收到删除子设备反馈:' + success);
                if (device.deleteChildDeviceCallBack != undefined) {
                    device.deleteChildDeviceCallBack(success);
                }
            }
            break;
        } else if (str == '') {

        }
    }

}

SocketClient.prototype.parseChildDevice = function parseChildDevice(raw, index) {
    var utils = new Utils();
    var deviceArray = new Array();
    console.log('收到子设备消息' + raw.length + 'deviceArray 的长度' + deviceArray.length);
    if (raw.length < index + 74) {
        console.log('收到子设备消息但是长度过短,应该是没有子设备');
        return deviceArray;
    }
    pkCount = utils.bytes2int(raw, index, 2);
    index = index + 2;
    console.log('总共' + pkCount + '个pk');
    var tag = index;
    for (var j = 0; j < pkCount; j++) {

        var pk = utils.hexCharCodeToStr((utils.bytes2string(raw, (tag), 32)));
        tag += 32;
        var chilidCount = utils.bytes2int(raw, tag, 2);
        tag += 2;
        console.log('该pk:' + pk + '   总共:' + chilidCount + '个设备');
        for (var m = 0; m < chilidCount; m++) {
            if (tag > raw.length) {
                return;
            }

            var childDevice = new ZADevice();
            childDevice.pk = pk;
            // tag += 34

            childDevice.sdid = utils.bytes2string(raw, (tag), 4);
            tag += 4;
            childDevice.online = raw[tag];
            tag += 1;
            childDevice.id = raw[tag];
            tag += 1;
            childDevice.mac = utils.hexCharCodeToStr(utils.bytes2string(raw, (tag), 10));
            tag += 10;
            childDevice.did = utils.hexCharCodeToStr(utils.bytes2string(raw, (tag), 22));
            tag += 22;
            deviceArray.push(childDevice);

            console.log('发现子设备：pk:' + childDevice.pk + 'chiliddevicedid:' + childDevice.did
                + ' 发现子设备：chiliddevicedid:' + childDevice.sdid + '\n子设备个数：' + deviceArray.length);
        }


    }
    return deviceArray;
}


function receiveDataLog(cmd, res) {

    var cmdType = '接受-其他';
    switch (cmd) {
        case  'login_res':
            cmdType = '接受-登录回调';
        case  'pong':
            cmdType = '接受-心跳';
            break;
        case  's2c_noti':
            cmdType = '接受-状态通知';
            break;
        case  's2c_invalid_msg':
            cmdType = '接受-错误消息';
            break;
        case  's2c_raw':
            cmdType = '接受-二进制';
            break;
    }
    var net = Net();
    net.log(getWechatOpenID(), res, cmdType);
}