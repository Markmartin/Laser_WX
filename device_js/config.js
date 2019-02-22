/**
 * 配置文件
 */


// var GizwitsHost  = "http://api1.iotsdk.com"
var GizwitsHost  = "http://api.gizwits.com"
var BerkeleyHost = "http://berkeley.nvc-lighting.com.cn"
 

function Config()
{

  return {
    GizwitsHost,
    BerkeleyHost,
    // gizwitsAppId:'f1170e445c9e459e8c0ef9d83014d9ca',
    gizwitsAppId:'b4abda741f4e4eccb333ecb0e7c4af94',
    gizwitsAppsecret:'042c69d88a2545c79b583919c677793a',
    commType:"custom",

    heartbeat_interval:160,
    //  中控设备  PRODUCT_KEY :PRODUCT_SECRET
    '1e455834299145bf8698d4ab98670044':'2df31aa4186b464da4436828b82bb8ca',
    //  全功率子设备  PRODUCT_KEY :PRODUCT_SECRET
    'c79af54b8ace4cf3b062bdcc9803830c':'0bd8314a0ec24ab98b63ed463f6a6344',
    //  半功率子设备  PRODUCT_KEY :PRODUCT_SECRET
    'dedcebae8d88450f84799db4d2e02e32':'7938bfb24b404f71ab01547974bf53ad',

    '3bc085259ef445caae081968c6bb9248':'ec962bf2e7a6410f81aac3b2cb7a9bd3',
    'abe287379548487880cae5941a98a9f1':'54fcefb93b2d442a900fc59e874c129c',
    'c49b2e9e1ec440eabdd2f3231e562f41':'a19c47d74c974cf0815ddfb951a98c97',
      
    // 登录地址，用于建立会话
    loginUrl: `${BerkeleyHost}/login`,
  }
}
//
// var config = {
//     // 下面的地址配合云端 Server 工作
//     GizwitsHost,
//     BerkeleyHost,
//     gizwitsAppId:"f1170e445c9e459e8c0ef9d83014d9ca",
//     commType:"custom",
//     heartbeat_interval:60,
//
//     // 登录地址，用于建立会话
//     loginUrl: `${BerkeleyHost}/login`,
//
// };
//
// this.exports = config
