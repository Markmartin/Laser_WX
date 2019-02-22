<#macro head title="Smart Led"> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
  		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  		<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    	
    	<meta HTTP-EQUIV="pragma" CONTENT="no-cache"> 
		<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate"> 
		<meta HTTP-EQUIV="expires" CONTENT="0">
    	
        <title>${title?html}</title>
		<link rel="stylesheet" href="css/jquery.mobile-1.4.5.css"/>
		<link rel="stylesheet" href="css/index.css"/>
		<script src="js/jquery.js"></script>
		<script src="js/jquery.mobile-1.4.5.js"></script>
		<script src="js/jqm-windows.mdialog.js"></script>
		<script src="js/Utils.js?v=1.6"></script>
		<!--<script src="js/debuggap.js"></script>-->
		<script>
		var ctrlUrl="wx_ctrl";
		//UTF字符转换
		var UTFTranslate = {
			Change:function(pValue){
				return pValue.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
			},
			ReChange:function(pValue){
				return unescape(pValue.replace(/&#x/g,'%u').replace(/\\u/g,'%u').replace(/;/g,''));
			}
		};
				
		</script>
		<style>
		body{background:#eeeeee;}
		</style>
		<#nested>
	</head>   
</#macro>

<#macro body> 
<body>
<#nested>
</body>

</html>

</#macro> 