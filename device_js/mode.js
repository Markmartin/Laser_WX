var defaultModelType = {
    //socket连接状态更新
    all: 'all',
    livingRoom: 'livingRoom',
    bedRoom: 'bedRoom',
    diningRoom: 'diningRoom',

};


function Mode(modelObject, modeID, cb) {
    if (modelObject == undefined && modeID != undefined) {
        // this.sceneId = sceneID;
        this.modeId = modeID;
        if (cb != undefined) {
            this.refreshMode(cb);
        }

    } else {
        this.setData(modelObject);
    }

}

Mode.prototype.setData = function setData(modelObject) {
    if (modelObject != undefined) {
        this.sceneId = modelObject.sceneId;
        this.modeId = modelObject.modeId;
        this.modeName = modelObject.modeName;
        this.modeIcon = modelObject.modeIcon;
        this.modeStatus = JSON.parse(modelObject.modeStatus);
        if (this.modeStatus != undefined) {
            this.S = this.modeStatus.S;
            this.Y = this.modeStatus.Y;
            this.W = this.modeStatus.W;
        } else {
            this.S = true;
            this.Y = 50;
            this.W = 50;
        }

        // var timer = modelObject.timers[index];
        this.modeTimer = new ModeTimers(modelObject.timers, this.modeId);
        //   this.timers.push(modeTimer);
        //
        // this.timers = new Array();
        // for(var index in modelObject.timers)
        // {
        //   var timer = modelObject.timers[index];
        //   var modeTimer = new ModeTimers(timer);
        //   this.timers.push(modeTimer);
        //
        // }
        this.isDefault = modelObject.isDefault;
    }
}

Mode.prototype.json = function json() {
    var jsonstr = {
        modeId: this.modeId,
        modeName: this.modeName,
        modeIcon: this.modeIcon,
    }
    return JSON.stringify(jsonstr);
}

//修改模式名字
Mode.prototype.updateName = function updateName(name, cb) {
    var url = "/update_mode.do";
    var net = new Net();
    var params = {
        "modeId": this.modeId,
        "modeName": name,
    }
    var net = Net();
    net.sceneReq(url, "POST", params, cb);
}

//修改模式的ICON
Mode.prototype.updateIcon = function updateIcon(icon, cb) {
    var url = "/update_mode.do";
    var net = new Net();
    var params = {
        "modeId": this.modeId,
        "modeIcon": icon,
    }
    var net = Net();
    net.sceneReq(url, "POST", params, cb);
}

//修改模式的灯具状态 S,W,Y
Mode.prototype.updateStautsWithSWY = function updateStautsWithSWY(s, w, y, cb) {
    var params = {
        'S': s,
        'W': w,
        'Y': y,
    }
    this.updateStauts(params, cb);
}

//修改模式的灯具状态
Mode.prototype.updateStauts = function updateStauts(status, cb) {
    var url = "/update_mode.do";
    var net = new Net();
    var params = {
        "modeId": this.modeId,
        "modeStatus": JSON.stringify(status),
    }
    var net = Net();
    net.sceneReq(url, "POST", params, cb);
}

//修改模式的定时
Mode.prototype.updateModeTimer = function updateStauts(modeTimer, cb) {
    var url = "/update_mode.do";
    var net = new Net();
    var params = {
        "modeId": this.modeId,
        "modeTimer": JSON.stringify(modeTimer),
    }
    var net = Net();
    net.sceneReq(url, "POST", params, cb);
}

//删除模式
Mode.prototype.deleteModel = function deleteModel(cb) {
    console.log('modeId' + this.modeId);
    var url = "/delete_mode.do";
    var net = new Net();
    var params = {
        "modeId": this.modeId,
    }
    net.sceneReq(url, "POST", params, cb);
}

//刷新模式
Mode.prototype.refreshMode = function refreshMode(cb) {

    var url = '/query_mode.do?mode_id=' + this.modeId;
    var net = new Net();

    var self = this;
    net.sceneReq(url, "GET", undefined, function (success, data) {
        if (success == true) {
            self.setData(data);
            console.log('刷新场景:' + JSON.stringify(self));
            cb(success);
        }
    });

}


//只能用于默认场景的比较，不能用于自定义场景的比较
Mode.equal = function equal(mode1, mode2) {
    if (mode1.modeName == mode2.modeName) {
        return true;
    }

    return false;
}

//获取默认模式列表

Mode.getDefaultModelList = function getDefaultModelList() {

    var modelList = new Array();
    var array = new Array();
    var names = ["会客", "日常", "观影", "夜灯", "聚餐", "助眠", "浪漫", "明亮", "回家", "游戏", "学习", "运动"];
    var status = [{'S': true, 'Y': 62, 'W': 100},//"会客"
        {'S': true, 'Y': 100, 'W': 50},//"日常"
        {'S': true, 'Y': 46, 'W': 25},//"观影"
        {'S': true, 'Y': 46, 'W': 10},//"夜灯"
        {'S': true, 'Y': 62, 'W': 100},//聚餐
        {'S': true, 'Y': 46, 'W': 25},//助眠
        {'S': true, 'Y': 46, 'W': 20},//浪漫
        {'S': true, 'Y': 62, 'W': 100}];//明亮


    // 客厅
    //
    // 会客   {'S':true, 'Y':62,'W':100}  model_0
    // 日常   {'S':true, 'Y':100,'W':50}  model_1
    // 观影   {'S':true, 'Y':46,'W':25}   model_2
    // 夜灯    {'S':true, 'Y':46,'W':10}  model_3

    //卧室
    //明亮  {'S':true, 'Y':62,'W':100} ];//明亮  model_7
    //"日常" {'S':true, 'Y':100,'W':50} , model_1
    //助眠 {'S':true, 'Y':46,'W':25}  ,  model_5
    //"夜灯" {'S':true, 'Y':46,'W':10} ,  model_3

    // //餐厅
    // {'S':true, 'Y':62,'W':100}  ,//聚餐  model_4
    // {'S':true, 'Y':100,'W':50} ,//"日常" model_1
    // {'S':true, 'Y':46,'W':20} ,//浪漫  model_6


    for (var i = 0; i < 8; i++) {
        var mode = new Mode();
        mode.modeName = names[i];
        mode.modeIcon = 'model_' + i;
        mode.modeStatus = status[i];

        modelList.push(mode);
    }
    return modelList;
}


Mode.defaultModelLsitOfType = function defaultModelLsitOfType(type) {
    var modelList = new Array();
    var array = new Array();
    var names = new Array()
    var status = new Array();
    switch (type) {
        case defaultModelType.all: {
            names = ["会客", "日常", "观影", "夜灯", "聚餐", "助眠", "浪漫", "明亮", "回家", "游戏", "学习", "运动"];
            status = [{'S': true, 'Y': 28.5, 'W': 100},//"会客"
                {'S': true, 'Y': 100, 'W': 50},//"日常"
                {'S': true, 'Y': 0, 'W': 25},//"观影"
                {'S': true, 'Y': 0, 'W': 10},//"夜灯"
                {'S': true, 'Y': 28.5, 'W': 100},//聚餐
                {'S': true, 'Y': 0, 'W': 25},//助眠
                {'S': true, 'Y': 0, 'W': 20},//浪漫
                {'S': true, 'Y': 28.5, 'W': 100}//明亮
            ];
        }
            break;
        case defaultModelType.livingRoom: {
            names = ["会客", "日常", "观影", "夜灯"];
            status = [{'S': true, 'Y': 28.5, 'W': 100},//"会客"
                {'S': true, 'Y': 100, 'W': 50},//"日常"
                {'S': true, 'Y': 0, 'W': 25},//"观影"
                {'S': true, 'Y': 0, 'W': 10}//"夜灯"
            ];

        }
            break;
        case defaultModelType.bedRoom: {
            names = ["明亮", "日常", "助眠", "夜灯"];
            status = [{'S': true, 'Y': 28.5, 'W': 100}, //明亮
                {'S': true, 'Y': 100, 'W': 50},//"日常"
                {'S': true, 'Y': 0, 'W': 25},//助眠
                {'S': true, 'Y': 0, 'W': 10}//"夜灯"
            ];
        }
            break;
        case defaultModelType.diningRoom: {
            names = ["聚餐", "日常", "浪漫"];
            status = [{'S': true, 'Y': 28.5, 'W': 100},//聚餐
                {'S': true, 'Y': 100, 'W': 50},//"日常"
                {'S': true, 'Y': 0, 'W': 20}//浪漫
            ];
        }
            break;
        default:


    }


    for (var i = 0; i < status.length; i++) {
        var mode = new Mode();
        mode.modeName = names[i];
        mode.modeIcon = 'model_' + i;
        mode.modeStatus = status[i];

        modelList.push(mode);
    }
    return modelList;
}
