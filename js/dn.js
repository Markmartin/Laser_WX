wx.ready(function () {
    console.log('wx ready!!!');
});
wx.error(function (res) {
    console.log('wx error!!!');
});


function showQRcode() {
    wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            console.log('qrcode result:' + result);
        }
    });
}

function gatewayScanQRCode() {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {

            // alert("接受到的返回的二维码数据:" + res.resultStr);
            var net = new Net();
            var code = getQueryStringOfStr("code", res.resultStr);
            // alert("获取二维码成功:"+ code);

            net.acceptGatewayShare(code, function (status, resp) {
                if (status == true || resp.status == 200) {
                    // alert("接受分享成功");
                    location.reload();
                }
                else {
                    alert("接受分享失败");
                }
            });
        }
    });
}


function deviceScanQRCode(did) {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var net = new Net();
            var qrCode = res.resultStr;
            var result = "";
            if (Number(qrCode)>=0)
            {
                net.getLiveCode(qrCode,function (status,resp) {
                    if (status == true)
                    {
                        // alert("接受到的返回的二维码数据:" + res.resultStr);
                        result = resp.qrcode; // 当needResult 为 1 时，扫码返回的结果
                        handleResult(result,did);
                    }
                })
            }else {
               result = qrCode;
               handleResult(result,did);

            }

        }
    });

}

function handleResult(result,did) {

    var resultArray = result.split("||");
    var shareDid = getQueryStringOfStr("did", resultArray[resultArray.length - 1]);
    if (shareDid != undefined && shareDid.length > 0) {
        if (did != shareDid) {
            //分享网关设备
            alert("请确认是否拥有该网关权限");
            return;
            // ShareManager.shareDeviceQRCode(shareDid, function (status, resp) {
            //     if (status == true) {
            //         net.acceptGatewayShare(resp, function (status, resp) {
            //             if (status == true || resp.status == 200) {
            //                 // alert("接受分享成功");
            //                 location.reload();
            //             }
            //             else {
            //                 alert("接受WG分享失败");
            //             }
            //         });
            //     }
            // })
        }else {
            var net = new Net();
            for (var index in resultArray) {
                var code = getQueryStringOfStr("code", resultArray[index]);
                net.acceptGatewayShare(code, function (status, resp) {
                    if (status == true || resp.status == 200) {
                        // alert("接受分享成功");
                        location.reload();
                    }
                });
            }
        }
    }

}

