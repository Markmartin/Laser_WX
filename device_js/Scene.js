/**
 * Created by liaodongnian on 2017/4/18.
 */
function Scene(sceneObject, sceneID, cb) {
    if (sceneObject == undefined) {
        this.sceneId = sceneID;
        this.customModels = new  Array();
        this.defaultModels = new  Array();
        this.modes = new  Array();
        this.refreshScene(cb);

    } else {
        this.setData(sceneObject);
    }

}


Scene.prototype.json = function json() {
    var jsonstr = {
        sceneId: this.sceneId,
        sceneName: this.sceneName,
    }
    return JSON.stringify(jsonstr);
}

Scene.prototype.setData = function setData(sceneObject) {
    if (sceneObject != undefined) {
        this.sceneId = sceneObject.sceneId;
        this.sceneName = sceneObject.sceneName;
        // this.delayClose = sceneObject.delayClose;
        this.isDefault = sceneObject.isDefault;
        this.openid = sceneObject.openid;
        this.dids = (sceneObject.dids == undefined ? new Array() : JSON.parse(sceneObject.dids));
        this.defaultModels = new Array();
        this.customModels = new Array();
        // this.models = new Array();
        if (sceneObject.modes == undefined) {
            this.modes = new Array();
            return;
        }
        for (var i = 0; i < sceneObject.modes.length; i++) {
            var model = new Mode((sceneObject.modes[i]));
            // models.push(model);
            model.isDefault == 1 ? this.defaultModels.push(model) : this.customModels.push(model);

        }
        this.modes = this.defaultModels.concat(this.customModels);
        if(sceneObject.taskStatus != undefined)
        {
            this.taskStatus = JSON.parse(sceneObject.taskStatus);
        }

    }
}


//场景的所有灯延迟关闭
Scene.prototype.delaySwitchDevice = function delaySwitchDevice(time,cb) {

  this.changeStatus({'delay': time}, cb);
    // for (var index in this.dids) {
    //     var config = new Config();
    //     var url = config.GizwitsHost + "/app/control/" + this.dids[index];
    //
    //     var params = {
    //         "attrs": {
    //             'delay': '60分钟'
    //         },
    //     };
    //     var net = new Net();
    //     net.GizwitsOpenAPI(url, "POST", params, cb);
    // }
}

//开关场景的所有灯
Scene.prototype.switchDevice = function switchDevice(state, cb) {
    this.changeStatus({"S": state}, cb);
}


Scene.prototype.changeStatus = function changeStatus(status, cb) {

    var selfindex = 0 ;
    var self = this;
    for (var index in this.dids) {


                var net = new Net();
                setTimeout(function () {

                    var url = "/app/control/" +self.dids[selfindex];
                    console.log('selfindex' + selfindex + ':'+self.dids[selfindex]);
                    // for (var i = 0; i < 2; i++) {
                    // var sParams = undefined;
                    // if (i == 0) {
                    //     if (status.S != undefined) {
                    //         sParams = {
                    //             'S': status.S,
                    //         }
                    //     }
                    // } else {
                    //     if (status.W != undefined) {
                    //         sParams = {
                    //             'Y': status.Y,
                    //             'W': status.W,
                    //         }
                    //     }
                    // }
                    if (status != undefined) {
                        var params = {
                            "attrs": status,
                        };
                        net.GizwitsOpenAPI(url, "POST", params, cb);
                    }
                    selfindex = selfindex+1;
                },index*500);

        // }
    }
}



//获取场景列表
Scene.getSceneList = function getSceneList(cb) {

    var url = "/query_scene.do?openid=" + getWechatOpenID();
    var net = new Net();
    net.sceneReq(url, "GET", undefined, function (success, data) {
        if (success == true) {
            var array = data;
            var sceneArray = new Array();
            for (var i = 0; i < array.length; i++) {
                var scene = new Scene(array[i]);
                sceneArray.push(scene);
            }
            console.log('获取场景列表解析之后的数据：')
            console.log(sceneArray);
            cb(success, sceneArray);
        } else {
            cb(success, undefined);
        }
    });
}


//添加场景
Scene.addScene = function addScene(sceneName, devices, cb) {

    var dids = new Array();
    for (var i = 0; i < devices.length; i++) {
        dids.push(devices[i].did);
    }

    var url = "/put_scene.do";
    var net = new Net();
    var params = {
        "sceneName": sceneName,
        'dids': JSON.stringify(dids),
        "openid": getWechatOpenID(),
        'isDefault' : 0,
    }
    net.sceneReq(url, "POST", params, function (success, data) {
        var id;
        var scene;
        if (success == true) {
            id = data.sceneId
            scene = new Scene();
            scene.sceneId = id;
        }
        cb(success, scene);
    });
}

//修改场景
Scene.prototype.updateScene = function updateScene(sceneName, devices, cb) {

    var dids = new Array();
    for (var i = 0; i < devices.length; i++) {
        dids.push(devices[i].did);
    }

    var url = "/update_scene.do";
    var net = new Net();
    var params;
    if(this.isDefault)
    {
        params = {
            "dids": JSON.stringify(dids),
            "sceneId": this.sceneId,
        }

    }else
    {
        params = {
            "sceneName": sceneName,
            "dids": JSON.stringify(dids),
            "sceneId": this.sceneId,
        }
    }

    net.sceneReq(url, "POST", params, cb);
}

//删除场景
Scene.prototype.deleteScene = function deleteScene(cb) {
    if(this.isDefault)
    {
        return;
    }
    var url = "/delete_scene.do";
    var net = new Net();
    var params = {
        "sceneId": this.sceneId
    }
    net.sceneReq(url, "POST", params, cb);
}


//添加默认模式
Scene.prototype.addDefaultModel = function addDefaultModel(defaultMode, cb) {
    var url = "/put_mode.do";
    var net = new Net();
    var self = this;
    var params = {
        "modeName": defaultMode.modeName,
        "modeIcon": defaultMode.modeIcon,
        "modeStatus": JSON.stringify(defaultMode.modeStatus),
        "modeTimer": '[]',
        "sceneId": this.sceneId,
        "openid":  getWechatOpenID(),
        "isDefault": 1,
    }
    // net.sceneReq(url,"POST",params,cb);
    net.sceneReq(url, "POST", params, function (success, data) {
        var mode;
        if (success == true) {
            mode = new Mode(data);
        }
        cb(success, mode);
    });
}

//判断默认模式是否被选择
Scene.prototype.inDefaultModel = function inDefaultModel(mode) {

    var has = false;
    if (this.defaultModels == undefined) {
        return has;
    }
    for (var i = 0; i < this.defaultModels.length; i++) {
        if (Mode.equal(this.defaultModels[i], mode)) {
            mode.modeId = this.defaultModels[i].modeId;
            has = true;
            break;
        }
    }

    return has;
}

//添加自定义模式
Scene.prototype.addCustomModel = function addCustomModel(modelName, modelIcon, cb) {
    var url = "/put_mode.do";
    var net = new Net();
    var self = this;
    var params = {
        "modeName": modelName,
        "modeIcon": modelIcon,
        "modeStatus": JSON.stringify({'S': true, 'Y': 50, 'W': 50}),
        // "modeTimer": JSON.stringify((modelTimer == undefined ? (new Array()):modelTimer)) ,
        "sceneId": this.sceneId,
        "openid":getWechatOpenID(),
        "isDefault": 0,
    }
    net.sceneReq(url, "POST", params, function (success, data) {
        var mode;
        if (success == true) {
            mode = new Mode(data);
        }
        cb(success, mode);
    });
}

// //判断自定义模式是否存在
// Scene.prototype.inCustomModel = function inCustonModel(mode) {
//     var has = false;
//     for (var i = 0; i < this.customModels.length; i++) {
//         if (Mode.equal(this.customModels[i], mode)) {
//             mode.modeId = this.customModels[i].modeId;
//             has = true;
//             break;
//         }
//     }
//
//     return has;
// }

//设置模式为当前模式
Scene.prototype.setCurrentModel = function setCurrentModel(mode, cb) {

    var status = mode.modeStatus;
    var self = this;

        var sParams = undefined;
    var sParams1 = undefined;

            if (status.S != undefined) {
                sParams = {
                    'S': status.S,
                }
            }

            if (status.W != undefined) {
                sParams1 = {
                    'Y': status.Y,
                    'W': status.W,
                }
            }

        if (sParams != undefined) {
            self.changeStatus(sParams, cb);
        }

    if (sParams1 != undefined )
    {
        setTimeout(function () {
            self.changeStatus(sParams1, cb);
        },self.dids.length*500);


    }
    // }
    if(mode.isDefault == 1)
    {
        return;
    }


    if(self.taskStatus != undefined)
    {
        for (var  index in  self.taskStatus)
        {
            var taskID = self.taskStatus[index];
            for(var  didIndex in self.dids)
            {
                var device = new  ZADevice();
                device.did = self.dids[didIndex];
                device.deleteTimer(self.taskStatus[index],function (success,data) {
                    console.log('删除回调定时'+JSON.stringify(data));
                });
            }
        }

    }

    mode.modeTimer.setModeTimerToDevice(this.dids,function (data) {

        console.log('设置模式定时成功回调');
        console.log(data);

            var url = "/update_scene.do";
            var net = new  Net();
            var params = {
                'sceneId': self.sceneId,
                'taskStatus' : JSON.stringify(data),
                'currMode' : mode.modeId,
            }
            net.sceneReq(url,"POST",params,cb);

    });

}

//
// Scene.prototype.switchModel = function switchModel(mode, cb) {
//
//     this.changeStatus(mode.modeStatus, cb);
//
//     // for (var index in this.deviceIDList)
//     // {
//     //     var config = new Config();
//     //     var ctrUrl = config.GizwitsHost + "/app/control/" + this.deviceIDList[index];
//     //     var ctrParams = {
//     //         "attrs": mode.modeStatus
//     //     };
//     //     var deviceUrl = config.GizwitsHost + "/app/devices/" + this.deviceIDList[index];
//     //
//     //     var net = new  Net();
//     //     net.GizwitsOpenAPI(ctrUrl,"POST",ctrParams,function (status,resposeObject) {
//     //
//     //     });
//     //
//     //     // var timerIDList = modelObject.split(",")
//     //     // net.GizwitsOpenAPI(deviceUrl,"GET",{},function (status,resposeObject) {
//     //     //     if (status == true )
//     //     //     {
//     //     //         var device = new ZADevice(resposeObject);
//     //     //         device.getTimerList(function (status,responseObject) {
//     //     //             if (status == true)
//     //     //             {
//     //     //                 //添加定时器
//     //     //             }
//     //     //         })
//     //     //     }
//     //     // })
//     // }
// }
//刷新场景下的模式
Scene.prototype.refreshScene = function refreshScene(cb) {
    var url = '/query_scene_byid.do?scene_id=' + this.sceneId;
    var net = new Net();

    var self = this;
    net.sceneReq(url, "GET", undefined, function (success, data) {
        if (success == true) {
            self.setData(data);
            console.log('刷新场景:');
            console.log(self);
            cb(success);
        }
    });
}
