<#import "/WEB-INF/view/template.ftl" as T>
<@T.head>
<style>
.header{height:60px;width:100%;}
.header>span{height: 60px; line-height: 60px;}
.ui-field-contain{display: inline-block;float: right;}
.status{height:50px;line-height:50px;color:#2c9bf4;float:right;}
</style>

<script type="text/javascript">
	var openid="${openid}";
	function flush(){
		//查询灯具列表
		/*post.QUERY_LIGHTS("${did}",function(data){
			console.log(data);
		});*/
		$("#lights").empty();
		for(var i=0;i<43;i++){
			$('#lights').append('\
				<li class="light_border">\
					<div class="light_title">\
						 <span class="light_name">Led '+i+'</span>\
						 <span class="status">已打开</span>\
					</div>\
					<div class="clear"/>\
				    <div class="ui-grid-a">\
					     <div class="ui-block-a">\
					     	<a href="wx?u=control_voice&did=${did}&index='+i+'" target="_self" data-role="button" class="light_btn1">语音控制</a>\
					     </div>\
					     <div class="ui-block-b">\
					      	 <a href="wx?u=control_hand&did=${did}&name=Led '+i+'&index='+i+'" target="_self" data-role="button" class="light_btn2">手势控制</a>\
					     </div>\
				    </div>\
				</li>\
			');
		}
		$("#lights").trigger('create');
	}
	 
	$(document).on("pageinit","#pageIndex",function(){
		//request the list of light;
		flush();
		
		websocket=new WebSocket("ws://sandbox.gizwits.com:8080/ws/app/v1");
		
		websocket.onopen = function(evt) { 
	        onOpen(evt) 
	    }; 
	    websocket.onclose = function(evt) { 
	        onClose(evt) 
	    }; 
	    websocket.onmessage = function(evt) { 
	        onMessage(evt) 
	    }; 
	    websocket.onerror = function(evt) { 
	        onError(evt) 
	    }; 
	});
	
        
    function onOpen(evt) { 
    	console.log("websocket open!")
    	//login
    	/*{
		    "cmd": "login_req",
		    "data":
		    {
		        "appid": , 
		        "uid": ,
		        "token":,
		        "p0_type": "custom", 
		        "heartbeat_interval":150 (心跳的时间间隔，单位为秒，值必须小于等于180)
		    }
		}*/
	}  
 
    function onClose(evt) { 
    	console.log("websocket close!")
    }  
 
    function onMessage(evt) { 
    	console.log(evt.data);
    }  
 
    function onError(evt) { 
    	console.log(evt.data);
    }  
 
	
	</script>

</@T.head>
<@T.body>
<div data-role="page" id="pageIndex">
	<div class="layer">
		<div data-role="content">
		 	<div class="header">
			 	<span>一键开关所有灯具</span>
			 	<div data-role="fieldcontain">
				    <select name="switch" id="switch" data-role="slider">
				      <option value="on">开</option>
				      <option value="off">关</option>
				    </select>
				 </div>
			 </div>
			  
			  <div class="lights">
			  		<ul data-role="none" id="lights">
		  				<!--<li class="light_border">
							<div class="light_title">
								 <span class="light_name">灯具名称</span>
								 <span class="status">已打开</span>
							</div>
							<div class="clear"/>
						    <div class="ui-grid-a">
							     <div class="ui-block-a">
							     	<a href="wx?u=control_voice&did=${did}" target="_self" data-role="button" class="light_btn1">语音控制</a>
							     </div>
							     <div class="ui-block-b">
							      	 <a href="wx?u=control_hand&did=${did}&name='灯1'&index=0" target="_self" data-role="button" class="light_btn2">手势控制</a>
							     </div>
						    </div>
						</li>-->
			  		</ul>
			  </div>
		</div>
	</div>
</div>
</@T.body>