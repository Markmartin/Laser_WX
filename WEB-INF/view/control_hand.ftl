<#import "/WEB-INF/view/template.ftl" as T>
<@T.head>

<style>
	/*.sle_set{text-align:left;border-radius: 6px;border: 1px solid #ccc;}
	.no_border{border:0;}*/
</style>

<script type="text/javascript">
	var did="${did}";
	$(document).on("pageinit","#lightCtrl",function(){
	    $("#br").on('slidestop', function( event ) {
		   b=$("#br").slider().val();
		   post.SEND_BRI('${did}',${index},b,function(){});
		});
	});
	  
	function ChangeEvent(obj,m){
		v=$(obj).val();
		if(v=='on'){
			post.SEND_OPEN(m,${index},function(data){});
		}else if(v=='off'){
			post.SEND_CLOSE(m,${index},function(data){});
		}
	}
	
</script>
</@T.head>
<@T.body>
<div data-role="page" id="lightCtrl">

		<div class="layer">
			<!--开关-->
			<div data-role="content">
				<div class="light_title">
					 <span class="light_name" style="line-height: 60px;">${name}</span>
					 <div data-role="fieldcontain" class="light_switch" style="margin:0;padding: 14px 0 0 0;">
					    <select name="switch" id="switch" data-role="slider" onchange="ChangeEvent(this,'${did}')">
					       <option value="off">关</option>
					       <option value="on" selected>开</option>
					    </select>
					 </div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="layer">
		<!--亮度-->
		<div data-role="content">
			<div class="light_title">
				 <span class="light_name">亮度</span>
			</div>
			<div class="clear_border"></div>
			 
			 <div data-role="fieldcontain">
			 	<img class="icon_ct" src="images/bright_low.png">
			    <img class="icon_ct icon_right" src="images/bright_high.png">
			    <input type="range" name="br" id="br" value="50" min="1" max="100" data-highlight="true">
			 </div>
		</div>
		<div class="clear_border"></div>
	</div>
</div>

</@T.body>