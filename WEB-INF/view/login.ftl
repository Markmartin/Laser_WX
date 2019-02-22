<#import "/WEB-INF/view/template.ftl" as T>
<@T.head>
</@T.head>
<@T.body>
<div data-role="page" style="background:url(images/regi_bg.jpg) no-repeat ;background-size:100% 100%;background-attachment: fixed;"">
	<div class="">
		<div data-role="content">
			<p style="margin-bottom:10px;"><img src='images/regi_logo.png'/></p>
	        <form method="post" id="loginform" action="wx_login" data-ajax="false">
	            <input type="text" name="username" id="username" value=""/><br>
	            <input type="password" name="password" id="password" value=""/>
	            <input type="submit" value="登录" data-role="none" style="background:#ec6d4b;width:100%;height:33px;border: 0;border-radius: 6px;color: #fff; margin: 30px 0;"/>
	        </form>
		</div>
	</div>
</div>

</@T.body>