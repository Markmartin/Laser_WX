<#import "/WEB-INF/view/template.ftl" as T>
<@T.head>

	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	
	<script>
		wx.config({
			beta:true,
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: '${appid}', // 必填，公众号的唯一标识
		    timestamp: '${signature.timestamp}', // 必填，生成签名的时间戳
		    nonceStr: '${signature.noncestr}', // 必填，生成签名的随机串
		    signature: '${signature.signature}',// 必填，签名，见附录1
		    jsApiList: ['scanQRCode','openWXDeviceLib','getWXDeviceTicket'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		
		wx.ready(function(){
			console.log('wx ready!!!');
		});
		wx.error(function(res){
			console.log('wx error!!!');
		});
		
	</script>
	
	<script type="text/javascript">
		function showQRcode(){
			wx.scanQRCode({
			    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
			    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
			    	console.log('qrcode result:'+result);
				}
			});
		}
		
	</script>
</@T.head>
<@T.body>
<div data-role="page" id="pageIndex">
	<div data-role="content">
	   <span>open_id:${openid}</span>
	</div>
	<div data-role="content">
		<div class="ui-grid-a">
		     <div class="ui-block-b">
		      	 <a href="javascript:void(0)" onclick="showQRcode();" data-role="button" class="ui-btn">扫码添加</a>
		     </div>
    	</div>
	</div>
</div>

</@T.body>