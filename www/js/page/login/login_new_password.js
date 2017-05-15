Zepto(function($) {
	var bind_name = 'input';
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		bind_name = 'propertychange';
	}
	/*设置新密码*/
	$(".set_new_pwd").bind(bind_name,function(){
		var pas1=$(".set_new_pwd").val();//密码
		var pas2=$(".set_cofim_pwd").val();//确认密码
		if(pas1 != null && pas1.length >= 8 && pas1.length <= 20){
			$(".error .pas-sp2").hide();
			if(pas2 != null && pas2.length >= 8 && pas2.length <= 20){
				$(".pass-nextstyle").removeClass("ah");
			}else{
				$(".pass-nextstyle").addClass("ah");
			}
			if(pas2 != ""){
				if(isPassEquals(pas1,pas2)){
						$(".error .pas-sp1").hide();
						$(".pass-nextstyle").removeClass("ah");
			  }else{
						$(".error .pas-sp1").css("visibility", "visible");
						$(".error .pas-sp1").show();
						$(".pass-nextstyle").addClass("ah");
		    }
			}
			
		}else{
			$(".pass-nextstyle").addClass("ah");
			$(".error .pas-sp2").css("visibility", "visible");
			$(".error .pas-sp2").show();
		}
	})
	$(".set_cofim_pwd").bind(bind_name,function(){
		var pas1=$(".set_new_pwd").val();//密码
		var pas2=$(".set_cofim_pwd").val();//确认密码
		if(isPassEquals(pas1,pas2)){
			$(".error .pas-sp1").hide();
			$(".pass-nextstyle").removeClass("ah");
		}else{
			$(".error .pas-sp1").css("visibility", "visible");
			$(".error .pas-sp1").show();
			$(".pass-nextstyle").addClass("ah");
		}
	})

/*设置新密码页面下一步按钮*/
	$("#np-next").click(function() {
		cordova.plugins.Keyboard.close();
		$(this).addClass("ah");

		//$(".pasOut").show().css("opacity", "0.65");
		//$(".pasInner").show();

		// 加载中动画...
		var Components = FFA.namespace('Components');
		var loading = Components.Popup.Loading('A');


		//var currentTimeMillion = getCurrentTime();//获取当前的时间
		var hashMap = new HashMap();
		/*var $deviceUUID=getDeviceUUID();
		var $timetamp = getCurrentTime();*/
		var $passwords=$(".set_new_pwd").val();
		var $passwords2=$(".set_cofim_pwd").val();
		if($passwords != null && $passwords.length >= 8 && $passwords.length <= 20){
			$(".error .pas-sp2").hide();
			if($passwords2 != null && $passwords2.length >= 8 && $passwords2.length <= 20){
				$(".pass-nextstyle").removeClass("ah");
				if(isPassEquals($passwords,$passwords2)){
					$(".error .pas-sp1").hide();
					$(".pass-nextstyle").removeClass("ah");
					
					http_post(newpwd_interface,httpYz(http_find_password_have_verification_code)
					,function(data_result){
						console.log("设置新密码成功"+JSON.stringify(data_result));
						if(data_result){
							if(data_result.codeInfo == 0){//新密码设置成功跳转到展业
									var session_poneNUmber = sessionStorage.getItem('pass_phone_session');
									var local_phonenumber = get(me_phonenumber);
									if(local_phonenumber!=null&&local_phonenumber.length>0){
										if(!(local_phonenumber==session_poneNUmber)){
											put(spot_query_version,"");
										}
									}
									//put(user_uuid,data_result.userUUID);//存放user_uuid
									put(me_phonenumber,session_poneNUmber);//存放手机号
									window.location.replace('../login/login.html');//跳转到登录页面重新登录
								} else if(data_result.codeInfo == 6){
									console.log("密码强度不够");
									$(".pas-fail").removeClass("ndis");
									$(".pas-fail-words").text(data_result.msgInfo);
							}
							}
					//$(".pasOut").hide().css("opacity", "0.65");
					//$(".pasInner").hide();

							// 删除加载中动画...
							loading.remove();
						}
						,function(xhr,e){//失败隐藏转动圈
							console.log("设置新密码失败xhr="+xhr+",,,e="+e);
							//$(".pasOut").hide().css("opacity", "0.65");
				    	//$(".pasInner").hide();

							// 删除加载中动画...
							loading.remove();

							});//请求网路服务
					
			}else{
					$(".error .pas-sp1").css("visibility", "visible");
					$(".error .pas-sp1").show();
					$(".pass-nextstyle").addClass("ah");
					//$(".pasOut").hide().css("opacity", "0.65");
					//$(".pasInner").hide();

					// 删除加载中动画...
					loading.remove();
		}
			}else{
				$(".error .pas-sp1").css("visibility", "visible");
				$(".error .pas-sp1").show();
				$(".pass-nextstyle").addClass("ah");
				//$(".pasOut").hide().css("opacity", "0.65");
				//$(".pasInner").hide();

				// 删除加载中动画...
				loading.remove();
			}
		}else{
			$(".pass-nextstyle").addClass("ah");
			$(".error .pas-sp2").css("visibility", "visible");
			$(".error .pas-sp2").show();
			//$(".pasOut").hide().css("opacity", "0.65");
			//$(".pasInner").hide();

			// 删除加载中动画...
			loading.remove();
		}
	});

	$(".pas-fail-sure").click(function(){
		$(".pas-fail").addClass("ndis");
	});
	
	
	/**
*找回密码网络请求参数
*identifying是否需要验证码
*/
function httpYz(identifyings){
	var pass1 = $(".set_new_pwd").val();
	var pass2 = $(".set_cofim_pwd").val();
	var captchas = sessionStorage.getItem('pass_yzm_session');
	var hashMap = new HashMap();
	var $deviceUUID = getDeviceUUID();
	var $timetamp = getCurrentTime();
	var phonenum = sessionStorage.getItem('pass_phone_session');
	hashMap.put(devUUID,$deviceUUID);
	hashMap.put(timestamp,$timetamp);
	hashMap.put(identifying,identifyings);
	hashMap.put(phoneNumber,phonenum);
	hashMap.put(password,pass1);
	hashMap.put(passwordCheck,pass2);
	if(captchas){
		hashMap.put(captcha,captchas);
		}else{
			hashMap.put(captcha,"");
			}
	
  console.log("验证码请求参数："+getJsonStr(hashMap));
  return getJsonStr(hashMap);
	}
	
})