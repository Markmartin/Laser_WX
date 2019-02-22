var config = new Config();


function Net() {

    return {
        login : login,
        bindDevice : bindDevice,
        unBindDevice : unBindDevice,
        getChildDeviceList : getChildDeviceList,
        log : log,

        GizwitsOpenAPI:GizwitsOpenAPI,
        sceneReq:sceneReq,
        zhuoAppGet:zhuoAppGet,
        updataDevcieName:updataDevcieName,
        querySceneByDid:querySceneByDid,
        updateSceneByDid:updateSceneByDid,
        deleteSceneByDid:deleteSceneByDid,
        acceptGatewayShare:acceptGatewayShare,
        getShareList:getShareList,
        cancleShare:cancleShare,
        storageLiveCode:storageLiveCode,
        getLiveCode:getLiveCode,
        deleteGatewayDevice:deleteGatewayDevice,
        // getSceneList:getSceneList,
    }

}

function login(wechatOpenId, cb) {
    var url = config.BerkeleyHost;
    if(wechatOpenId != undefined)
    {
        localStorage.setItem('openID',wechatOpenId);
    }else
    {
      wechatOpenId = getWechatOpenID();
    }

    if(wechatOpenId == undefined)
    {
      console.log('wechatOpenId 不正确');
      return;
    }

    console.log(url + 'this.config' + config);
    url = `${url}/info?openid=${wechatOpenId}`;
    self = this;

    zhuoAppGet(url, function (success,result) {
       if(success != true)
       {
         cb(new Array(),new Array());
         return;
       }
        console.log('登录后获取列表' + result.devices.length);

        localStorage.setItem('uid',result.uid);
        localStorage.setItem('token',result.token);

        var gateArray = new Array();
        var childArray = new Array();
        for (var i =0 ;i < result.devices.length;i++)
        {
          var device = new ZADevice(result.devices[i]);
          if(result.devices[i].type == 'center_control')
          {

            gateArray.push(device);
          }else{
            childArray.push(device);

            // self.unBindDevice(device.did,function(data){
            //
            // });
          }
        }
        console.log('网关的个数:'+gateArray.length);
        cb(gateArray,childArray);
    });

}

function getChildDeviceList(gateway, getChildDevicesCB) {

    _openID = getWechatOpenID();


    var self = this;
    login(_openID,function(gateArray,childArray)
    {
      var  webDevices = childArray;
      console.log('获取到的网络子设备列表个数：'+webDevices.length);
      //登录成功获取子设备列表
      gateway.getChildDevice( function (centerDevices) {
      console.log('获取到的网关中的子设备列表个数：'+centerDevices.length);

      deviceArray = new Array();


      if(centerDevices == undefined)
      {
          //如果没有子设备，则返回空
          getChildDevicesCB(deviceArray);
          return;
      }

      for(var i = 0 ;i<centerDevices.length;i++) {
          has = false;
          var currentDevice;
          for (var j = 0; j < webDevices.length; j++) {

              // console.log('webDevices : '+webDevices[j].did +'   mac:'+webDevices[j].mac);
              if (webDevices[j].did == centerDevices[i].did) {
                  // console.log('centerDevices :'+  centerDevices[i].did +'   mac:'+centerDevices[j].mac);
                  has = true;
                  currentDevice = new ZADevice(webDevices[j]);
                  currentDevice.sdid = centerDevices[i].sdid;
                  currentDevice.remark = currentDevice.is_online ? '在线' : '离线';
                  // currentDevice.dev_alias = currentDevice.dev_alias + parseInt(centerDevices[i].sdid, 16);
                  currentDevice.dev_alias = currentDevice.dev_alias ;
                  currentDevice.gatewayDevice = gateway;
              }
          }
          if (has) {
              console.log('既在网关，又在云端的设备：currentDevice : '+ currentDevice.dev_alias +'    did：' + currentDevice.did + '   mac:' + currentDevice.mac + '  is_online:' + currentDevice.is_online);
              deviceArray.push(currentDevice);
          }
      }

      if(gateway.getHasAddChildRole() == false)
      {
          getChildDevicesCB(deviceArray);
          return;
      }


      var needBindArray = new Array();
      for(var j = 0; j< centerDevices.length; j++ ) {
          has = false;
          var currentDevice;
          for (var i = 0; i < webDevices.length; i++) {

              console.log('webDevices : ' + webDevices[i].did);
              if (webDevices[i].did == centerDevices[j].did) {
                  console.log('centerDevices :' + centerDevices[j].did);
                  has = true;
              }
          }
          if (!has) {
              currentDevice = centerDevices[j];
              console.log('既在网关，不在云端的设备：currentDevice : ' + currentDevice.did + '   mac:' + currentDevice.mac + '  is_online:' + currentDevice.is_online);
              needBindArray.push(currentDevice);
          }
      }


      for(var i =0; i < needBindArray.length ; i++) {
          var unbindevice = needBindArray [i];
          console.log('需要绑定设备： currentDevice : ' + unbindevice.pk + '  mac:' + unbindevice.mac);
          self.bindDevice(unbindevice.pk, unbindevice.mac, '灯具-'+unbindevice.mac, function (data) {
              console.log('已经绑定设备回调：' + JSON.stringify(data));
              if (data == true) {
                  getChildDeviceList(gateway, getChildDevicesCB);
              }

          });

      }





        // for(var j=0; j<centerDevices.length;j++)
        // {
        //   var device = centerDevices[j];
        //   self.bindDevice(device.pk,device.mac,'设备',function(date){
        //
        //   });
        //
        // }
        getChildDevicesCB(deviceArray);

      });
    });


    return gateway;
}


function bindDevice(pk, mac, name, cb) {

    var url = `${config.GizwitsHost}/app/bind_mac`
    var json = '{"dev_alias": "'+name+'", "product_key":"'+pk+'", "mac": "'+mac+'", "remark": ""}';
    _openID = getWechatOpenID();
    log('openID:'+_openID,json,'发送绑定接口');
    console.log('绑定设备:' + json);
    gizwitsPost(url, pk, json, function (data) {
        console.log('收到回调' + data);
        cb(data);
    });
}

function  updataDevcieName(name, did ,cb) {
    var url = `${config.GizwitsHost}/app/bindings/${did}`;
    var json = {
        'dev_alias':name,
    }

    gizwitsNormalPost(url,'PUT',json,cb);

}

function unBindDevice(did, cb) {

    var url = `${config.GizwitsHost}/app/bindings`
    var json = {
      "devices": [
        {
          "did": did
        }
      ]
    };

    gizwitsNormalPost(url,'DELETE',json,function (success,res) {
        if(success)
        {
            cb(true,res);
        }else
        {
            console.log('解除绑定设备失败' + evt);
            cb(false);
        }
    })
}



function  gizwitsNormalPost(url,type,params,cb) {

    _token = getToken();
    config = new Config();
    var appID = config.gizwitsAppId;

    $.ajax(url, {
        type: type,
        contentType: "application/json",
        headers: {
            'X-Gizwits-User-token':_token,
            'X-Gizwits-Application-Id':appID,
        },
        dataType: "json",
        data:JSON.stringify(params) ,
        cache: false,
    }).done(function (result) {
        cb(true,result);
    }).fail(function (evt) {
        cb(false,evt);
    });
}



function gizwitsPost(url,pk,data,cb)
{

  // _token = $.cookie('token');
    _token = getToken();
  var timestamp = Date.parse(new Date())/1000;
    console.log('timestamp:'+timestamp);

  var secrect  = config[pk];
  // '0bd8314a0ec24ab98b63ed463f6a6344'
  // console.log('pk:'+pk+'  secrect:'+secrect);
  var str = (secrect+timestamp);
  // console.log('md5前的'+str);
  var hash = md5(str);
  config = new Config();
  var appID = config.gizwitsAppId;
  console.log('md5后的'+hash+'***'+appID);
  $.ajax(url, {
      type: "POST",
      headers: {
        'X-Gizwits-User-token':_token,
        'X-Gizwits-Application-Id':appID,
        'X-Gizwits-Timestamp':timestamp,
        'X-Gizwits-Signature':hash,
      },
      contentType: "application/json",
      dataType: "json",
      data: data,
      cache: false,
  }).done(function(result) {
    cb(result);
    log('openID:'+JSON.stringify(result),'收到绑定回调成功');
    console.log( '云端绑定设备成功' + JSON.stringify(result));
  }).fail(function(evt) {
    console.log( '云端绑定设备失败' + JSON.stringify(evt));
        log('openID:'+JSON.stringify(evt),'收到绑定回调失败');
    cb(false);
  })

}

function GizwitsOpenAPI(url,reqMode,params,cb)
{
    var config = new  Config();
    $.ajax({
        headers: {
            'X-Gizwits-Application-Id':config.gizwitsAppId,
            'X-Gizwits-User-token':getToken(),
        },
        url:config.GizwitsHost+url,
        type:reqMode,
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(params),
        cache: false,
    }).done(function (result) {
        cb(true,result);
    }).fail(function (error) {
        cb(false,error);
    });
}


function acceptGatewayShare(qrCode,cb) {
    var url = "/app/sharing/code/"+qrCode;
    GizwitsOpenAPI(url,"POST",undefined,cb)
}


function zhuoAppGet(url, cb) {

    $.ajax(url, {
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        cache: false,
        // data: "{\"openid\":\"" + wechatOpenId + "}"
    }).done(function (result) {
        cb(true,result);
    }).fail(function (evt) {
        console.log('请求失败' + evt);
        cb(false,undefined);
    })
}

function deleteGatewayDevice(mac,did,cb) {
    var param={
        openid:getWechatOpenID(),
        mac:mac,
        did:did
    }
    liveCodeRequest("/unbind","POST",param,cb);
}

function storageLiveCode(qrcode,cb) {
    liveCodeRequest("/put_qrcode.do","POST",{"qrcode":qrcode},cb);
}

function getLiveCode(qrcode_id,cb) {
    liveCodeRequest("/query_qrcode.do","GET",{"qrcode_id":qrcode_id},cb);
}

function liveCodeRequest(url,reqModel,params,cb) {
    var congfig = new Config();
    var host = config.BerkeleyHost;
    // var host =  'http://192.168.1.14:8080/nvc';
    $.ajax({
        url: host +url,
        type:reqModel,
        contentType:"application/x-www-form-urlencoded",
        data: params ,
        timeout:30000,
        cache: false,
    }).done(function (result) {
        console.log( '请求zhuo的接口成功：');
        console.log(result);
        if (result.status == 'fail')
        {
            cb(false,undefined);
        }else
        {
            cb(true,result);
        }
    }).fail(function (error) {
        cb(false,error);
        // console.log( '请求zhuo的接口失败：' + JSON.stringify(error));
        console.log( '请求zhuo的接口失败：');
        console.log(error);
    });
}


function sceneReq(url,reqModel,params,cb) {
    var congfig = new Config();
    var host = config.BerkeleyHost;
    // var host =  'http://192.168.1.14:8080/nvc';
    $.ajax({
        url: host +url,
        type:reqModel,
        contentType:"application/json",
        dataType: "json",    //'jsonp' "json"
        data: JSON.stringify(params) ,
        timeout:30000,
        cache: false,
    }).done(function (result) {
        console.log( '请求zhuo的接口成功：');
        console.log(result);
        if (result.status == 'fail')
        {
            cb(false,undefined);
        }else
        {
            cb(true,result);
        }
    }).fail(function (error) {
        cb(false,error);
        // console.log( '请求zhuo的接口失败：' + JSON.stringify(error));
        console.log( '请求zhuo的接口失败：');
        console.log(error);
    });

}


function sceneReqOfChildDevice(url,reqMode,params,cb) {
    var congfig = new Config();
    var host = config.BerkeleyHost;
    // var host =  'http://192.168.1.14:8080/nvc';

    $.ajax({
        url: host +url,
        type:reqMode,
        contentType:"application/json",
        dataType: "json",    //'jsonp' "json"
        data: params ,
        timeout:30000,
        cache: false,
    }).done(function (result) {
        console.log( '请求zhuo的接口成功：');
        console.log(result);
        if (result.status == 'fail')
        {
            cb(false,undefined);
        }else
        {
            cb(true,result);
        }
    }).fail(function (error) {
        cb(false,error);
        // console.log( '请求zhuo的接口失败：' + JSON.stringify(error));
        console.log('请求zhuo的接口失败：');
        console.log(error);
    });
}

function log(did, json,type)
{
  var data = {
    'did' : '',
    'openID' :getWechatOpenID(),
    'json' : json,
    'type' : type,
  }

  var url = config.BerkeleyHost;
  url = `${url}/log`;
  // ?content='${JSON.stringify(data)}'
  console.log('url:'+url);
  $.ajax(url, {
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data:JSON.stringify(data) ,
      cache: false,
  }).done(function (result) {
      // cb(result);
  }).fail(function (evt) {

      // cb(false);
  });

}

function  getWechatOpenID() {
    return localStorage.getItem('openID');
}

function  getToken() {
    return localStorage.getItem('token');
}


function  getUid() {
    return localStorage.getItem('uid');

}
// this.exports={
//     login:login(wechatOpenId,cb),
// }

//根据设备ID查询场景列表
function querySceneByDid(did,cb) {
    var params = {
        "did":did,
        "openid":getWechatOpenID()
    }
    // sceneReqOfChildDevice("/query_scene_bydid.do","GET",jQuery.param(params),cb);
    sceneReq("/query_scene_bydid.do?did="+did+"&openid="+getWechatOpenID(),"GET",undefined,cb);
}


//更新子设备设置页面的场景
function updateSceneByDid(sceneID,did,cb) {
    var params = {
        "sceneId":sceneID,
        "did":did,
        "openid":getWechatOpenID()
    }
    sceneReq("/update_scene_did.do","POST",params,cb);
}

//删除子设备设置页面的场景
function deleteSceneByDid(sceneID,did,cb) {
    var params = {
        "sceneId":sceneID,
        "did":did,
        "openid":localStorage.getItem('openID')
    }
    sceneReq("/delete_scene_did.do","POST",params,cb);
}

//查询已经发出去并被接受的分享
function getShareList(cb) {
    var params = {
        "sharing_type":"0",
        "status":"1"
    };
    params = $.param(params);
    GizwitsOpenAPI("/app/sharing?"+params,"GET",undefined,cb)
}


function cancleShare(shareID,cb) {
    GizwitsOpenAPI("/app/sharing/"+shareID,"DELETE",undefined,cb)
}