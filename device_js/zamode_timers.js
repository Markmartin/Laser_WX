

function ModeTimers(timerArrayJsonObject,modeID,cb)
{

    var self = this;
    this.timerArray = new  Array ();
  if(timerArrayJsonObject != undefined)
  {
    // this.modeId = 59;
    //   self.timer = new Timer(modeJsonObject);
      self.setData(timerArrayJsonObject);
  }
  if(modeID != undefined)
  {
      self.modeId = modeID;
  }
  if (cb != undefined)
  {

      self.getModeTimerList(cb);

  }

}

//获取mode下的定时列表
ModeTimers.prototype.getModeTimerList = function getModeTimerList(cb)
{
  var url = "/query_timer.do?mode_id="+this.modeId;
  var net = new Net();
  var self = this;
  net.sceneReq(url,'GET',undefined,function(success,data)
  {
      if(success == true)
      {
          self.setData(data);
      }
      cb(success);
  });



}


ModeTimers.prototype.setData = function  setData(data) {


    this.timerArray = new Array();


    for(var i = 0;i<data.length;i++) {
        var timer = new Timer(JSON.parse(data[i].status));
        timer.timerId = data[i].timerId;
        timer.modeId = data[i].modeId;
        timer.gizwitsBody = JSON.parse(data[i].status);
        this.timerArray.push(timer);
    }

}

//给mode添加定时
ModeTimers.prototype.addModeTimer = function addModeTimer(repeat, date, deviceState, weakadys, cb) {
    var url = "/put_timer.do";
    var json = ZADevice.getModelTimerJSON(repeat, date, deviceState, weakadys);
    var params = {
        modeId: this.modeId,
        status: json,
    }
    var net = new Net();
    net.sceneReq(url, "POST", params, cb);
}


//给mode修改定时
ModeTimers.prototype.modifyModeTimer = function modifyModeTimer(timerId, repeat, date, deviceState, weakadys, cb) {
    var url = "/update_timer.do";


    var json = ZADevice.getModelTimerJSON(repeat, date, deviceState, weakadys);
    var params = {
        timerId: timerId,
        status: json,
    }
    var net = new Net();
    net.sceneReq(url, "POST", params, cb);
}

ModeTimers.prototype.delModeTimer = function delModeTimer(timerId, cb) {
    var url = "/delete_timer.do";
    var params = {
        timerId: timerId,
    }
    var net = new Net();
    net.sceneReq(url, "POST", params, cb);
}


ModeTimers.prototype.setModeTimerToDevice = function setModeTimerToDevice(dids, cb) {


    if (dids == undefined || this.timerArray == undefined || dids.length == 0 || this.timerArray.length == 0) {
        cb(new Array());
        return;
    }
    var self = this;
    var net = new Net();
    var config = new Config();
    var idArray = new Array();
    var count = 0;
    for (var i = 0; i < dids.length; i++) {
        var did = dids[i];
        //  var url=config.GizwitsHost+"/app/devices/"+this.did+"/scheduler/";
        for (var j = 0; j < this.timerArray.length; j++) {
            var timer = this.timerArray[j];
            var url = "/app/devices/" + did + "/scheduler";
            if (timer.gizwitsBody.repeat == "none")
            {
                var timerArray = timer.gizwitsBody.time.split(":");
                var now = new Date();
                if (parseInt(timerArray[0]) < now.getUTCHours())
                {
                    now.setTime(now.getTime()+24*60*60*1000);
                }
                else if (parseInt(timerArray[0]) == now.getUTCHours())
                {
                    if (parseInt(timerArray[1]) <= now.getUTCMinutes())
                    {
                        now.setTime(now.getTime()+24*60*60*1000);
                    }
                }
                timer.gizwitsBody.date=now.getFullYear()+"-"+appendZero(now.getMonth()+1)+"-"+appendZero(now.getDate());

            }
            net.GizwitsOpenAPI(url, "POST", timer.gizwitsBody, function (success, data) {
                count++;
                if (success == true) {
                    idArray.push(data.id);
                }
                if (count == dids.length * self.timerArray.length) {
                    cb(idArray);
                }
                console.log('收到定时回调：' + JSON.stringify(data));
            });
        }
    }
}

function appendZero(num) {
    return num<10?"0"+num:num;
}

// ModeTimers.prototype.
