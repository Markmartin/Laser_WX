//websocket 单例
var _instance = null;

function WebSocketInstance() {

}

function  GetWebSocketInstance() {

    if (!_instance) {
        _instance = new  WebSocketInstance();
    };
    return _instance;

}


//查找websocket
WebSocketInstance.prototype.findWebSocket = function findWebSocket(device,type) {

    var webSocket;
    if (this.socketClientArray == undefined)
    {
        this.socketClientArray = new  Array();
    }

    for (var i = 0; i < this.socketClientArray.length; i++) {
        var client = this.socketClientArray[i];
        if(client.host == device.host && client.port == device.ws_port && client.type == type )
        {
            webSocket = client;
            break;
        }
    }

    if(webSocket == undefined)
    {
        webSocket = new SocketClient(device);
        webSocket.type = type;
        this.socketClientArray.push(webSocket);
    }else
    {
        webSocket.deviceArray.push(device);
    }
    return webSocket;
}

//二进制数据透传
WebSocketInstance.prototype.connectAndLogin = function connectAndLogin(device,type)
{

    var webSocket = this.findWebSocket(device,type);
    webSocket.connectAndLogin();
    // webSocket.conn (device,raw);

}


//二进制数据透传
WebSocketInstance.prototype.wirteRaw = function wirteRaw(device,raw)
{

    var webSocket = this.findWebSocket(device,'custom');
    webSocket.c2s_raw(device,raw);

}

//控制数据普通数据
WebSocketInstance.prototype.wirteAttribute = function wirteAttribute(device,raw)
{
    var webSocket = this.findWebSocket(device,'attrs_v4');
    webSocket.c2s_write(device,raw);
}


//Json送数据
WebSocketInstance.prototype.sendJson = function wirteAttribute(device,raw)
{
    var webSocket = this.findWebSocket(device,'attrs_v4');
    webSocket.sendJson(raw);
}
