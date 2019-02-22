<#import "/WEB-INF/view/template.ftl" as T>
<@T.head>

	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	
	
	<script>
		wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: '${appid}', // 必填，公众号的唯一标识
		    timestamp: '${signature.timestamp}', // 必填，生成签名的时间戳
		    nonceStr: '${signature.noncestr}', // 必填，生成签名的随机串
		    signature: '${signature.signature}',// 必填，签名，见附录1
		    jsApiList: ['startRecord','stopRecord','onVoiceRecordEnd','translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		
		wx.ready(function(){
			console.log('wx ready!!!');
		});
		wx.error(function(res){
			console.log('wx error!!!');
		});
		$(document).on("pageinit","#pageIndex",function(){
			$('#voice').on('touchstart', function(event){
			    event.preventDefault();
			    $('#voice_control').show();
			    START = new Date().getTime();
			    
			    recordTimer = setTimeout(function(){
			        wx.startRecord({
			            success: function(){
			                localStorage.rainAllowRecord = 'true';
			            },
			            cancel: function () {
			                alert('用户拒绝授权录音');
			            }
			        });
			    },300);
			});
			//松手结束录音
			$('#voice').on('touchend', function(event){
			    event.preventDefault();
			    $('#voice_control').hide();
			    END = new Date().getTime();
			    
			    if((END - START) < 300){
			        END = 0;
			        START = 0;
			        //小于300ms，不录音
			        clearTimeout(recordTimer);
			    }else{
			        wx.stopRecord({
			          success: function (res) {
			            translate(res.localId)
			          },
			          fail: function (res) {
			            alert(JSON.stringify(res));
			          }
			        });
			    }
			});
		});
		function translate(id){
			wx.translateVoice({
			   localId: id, // 需要识别的音频的本地Id，由录音相关接口获得
			    isShowProgressTips: 1, // 默认为1，显示进度提示
			    success: function (res) {
			    	voiceCmd(res.translateResult);
			    	$('#cmd').append('<span>'+res.translateResult+'</span>');
			    	$('#cmd').append('<br/>');
			    	scrollBottom();
			    }
			});
		}
		
		function voiceCmd(data){
			if(data.indexOf('亮度')>=0){//control the bright
			
				var dataArr=data.split('号');
				var index_ch=dataArr[0].replace(/[^('零'|'一'|'二'|'三'|'四'|'五'|'六'|'七'|'八'|'九'|'十')]/ig,""); 
				var index=TextToNumber(index_ch);
				
				var bright_ch=dataArr[1].replace(/[^('零'|'一'|'二'|'三'|'四'|'五'|'六'|'七'|'八'|'九'|'十'|'百')]/ig,""); 
				var bright=TextToNumber(bright_ch);
				if(bright>100){
					console.log('out of range');
					alert('out of range,max 100');
					return;
				}
				console.log('bright-->'+'index:'+index+'bright:'+bright);
				post.SEND_BRI('${did}',index,bright,function(data){});
				
			}else{//control the switch
				var value = data.replace(/[^('零'|'一'|'二'|'三'|'四'|'五'|'六'|'七'|'八'|'九'|'十')]/ig,""); 
				var index=TextToNumber(value);
				console.log('switch--> index:'+index);
				if(data.indexOf('开')>=0){
					post.SEND_OPEN('${did}',index,function(data){});
				}else if(data.indexOf('关')>=0){
					post.SEND_CLOSE('${did}',index,function(data){});
				}
			}
			
		}
		
		function scrollBottom() {
			  if($('#cmd>span').size()>15){
			  	 $('#cmd>span:first').remove();
			  	 $('#cmd>br:first').remove();
			  	 scrollBottom();
			  }
		}
		
	</script>
	
</@T.head>
<@T.body>
<div data-role="page" id="pageIndex">
	<div data-role="content">
		 <p id="cmd">
		 </p>
		 <div id="msg_end" style="height:0px; overflow:hidden"/>
		 <div style="width:100%;position:fixed;left:0;bottom:0;background:white;">
		 	<div  style="text-align:center;margin:20px;">
		 		<img id="voice_control" src='images/record_voice.gif' style="display:none;"/>
		 		<input id="voice" type="button" value="开始录音">
		 	</div>
		 </div>
	</div>
</div>

</@T.body>