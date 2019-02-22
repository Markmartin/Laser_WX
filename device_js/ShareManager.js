/**
 * Created by zhutc on 2017/5/5.
 */
function ShareManager() {

}

ShareManager.shareDeviceQRCode = function shareGatewayDevice(did,cb) {
    getShareQRCode(did,cb);
}


ShareManager.createQRCode = function createQRCode(childDeviceArray,cb) {
    var count = 0;
    var qrCodeArrayStr = "";
    for (var index in childDeviceArray)
    {
        var childDevice = childDeviceArray[index];

        getShareQRCode(childDevice.did,function (status,resp) {
            count++;
            if (status == true)
            {
                if (count != 1 && qrCodeArrayStr.length>0)
                {
                    qrCodeArrayStr = qrCodeArrayStr + "||";
                }
                qrCodeArrayStr = qrCodeArrayStr + resp;
            }

            if (count == childDeviceArray.length)
            {
                if (qrCodeArrayStr.length == 0)
                {
                    cb(false,undefined);
                }else{
                    cb(true,qrCodeArrayStr);
                }

            }
        })

    }
}

function getShareQRCode(did,cb) {
    var param = {
        "type": 1,
        "did": did,
        "uid": "",
        "username": "",
        "email": "",
        "phone": "",
        "show_qrcontent": 0
    };
    var url="/app/sharing";
    var net = new Net();
    net.GizwitsOpenAPI(url,"POST",param,function (status,resp) {
        if (status == true) {
            cb(true,resp.qr_content);
        }else{
            cb(false,resp);
        }
    });
}