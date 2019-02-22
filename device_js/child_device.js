var gatewayDevice;
var device;
function ChildDevice(gateway)
{
    gatewayDevice = gateway;
    return {
        openORclose: openORclose,
    }
}


function openORclose(open)
{

  var config = new Config();

  url = `${config.GizwitsHost}/app/control/${this.did}`;
    var json = '{"attrs":{  "S":'+ open+'}}';
    _token = $.cookie('token');
    var appID = config.gizwitsAppId;
    $.ajax(url, {
        type: "POST",
        headers: {
          'X-Gizwits-User-token':_token,
          'X-Gizwits-Application-Id':appID,
        },

        contentType: "application/json",
        dataType: "json",
        data: json,
    }).done(function(result) {

    console.log( '发指令' + result);
    }).fail(function(evt) {
        console.log( '发指令' + evt);
    })

}
