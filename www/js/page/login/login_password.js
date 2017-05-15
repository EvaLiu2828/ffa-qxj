var pass_yzm_result = ""; //找回密码获取验证码结果
Zepto(function($) {
	var bind_name = 'input';
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		bind_name = 'propertychange';
	}

	/*找回密码点击获取验证码按钮*/
	Zepto(".pas-getcode").click(function() {
		var $inputPhoneNumber = $(".phone").val();
		var yzm = $(".pas-dxyzm").val();
		if (isPhoneNumber($inputPhoneNumber)) {

			$(this).addClass("next-check");

            // 加载中...
            //$(".pasOut").show().css("opacity", "0.65");
            //$(".pasInner").show();

			// 加载中动画...
			var Components = FFA.namespace('Components');
			var loading = Components.Popup.Loading('A');



			console.log("找回密码地址" + newpwd_interface);
			http_post(newpwd_interface, httpYz(http_find_password_response_verification_code), function(pas_yzm) {
					console.log("找回密码验证码成功" + JSON.stringify(pas_yzm));

                    // 隐藏掉 加载中...
                    //$(".pasOut").hide().css("opacity", "0.65");
					//$(".pasInner").hide();

					loading.remove();

					pass_yzm_result = pas_yzm;

					var codeInfo = pas_yzm.codeInfo;
					if (codeInfo == 10) {			//手机号未注册
						$('.pascon').css('display', 'block');
						$('.pasOut2').css('display', 'block');
					}


					
					if (codeInfo == 0) {		//验证码发送成功
                        // 隐藏
                        $(".pas-getcode").hide().next().show();

                        // 倒计时
                        var time0 = 60;
                        function time() {
                            $(".time").text(time0);
                            time0 = time0 - 1;
                            if (time0 < 0) {
                                $(".pas-change").show();
                                $(".pas-timechange").hide();
                                window.clearInterval(ti);
//                            $(".pasOut").hide().css("opacity", "0.65");
//                            $(".pasInner").hide();
                            };
                        }
                        var ti = window.setInterval(time, 1000);

						$('.password_yzm_dilog').css('display', 'block');
					}
				},
				function(xhr, e) {
					console.log("找回密码验证码失败" + "xht=" + JSON.stringify(xhr) + ",,e=" + e);
					//$(".pasOut").hide().css("opacity", "0.65");
					//$(".pasInner").hide();
					loading.remove();
					$('.pas-dxyzm').focus();
				}
			); //请求网络服务	
		}
	});



	/*找回密码手机号未注册弹出框*/
	Zepto(".pas-confim").click(function() {
		//确认操作
		$('.pascon').hide();
		$('.pasOut2').hide();
		$('.pas-dxyzm').focus();
		window.location.href = "../../html/login/login.html";
		sessionStorage.setItem('pass_from', 'password_jump');
	})

	/**
	 *找回密码网络请求参数
	 *identifying是否需要验证码
	 */
	function httpYz(identifyings) {
		var $inputPhoneNumber = $(".phone").val();
		var yzm = $(".pas-dxyzm").val();
		var hashMap = new HashMap();
		var $deviceUUID = getDeviceUUID();
		var $timetamp = getCurrentTime();
		hashMap.put(devUUID, $deviceUUID);
		hashMap.put(timestamp, $timetamp);
		hashMap.put(identifying, identifyings);
		hashMap.put(phoneNumber, $inputPhoneNumber);
		hashMap.put(password, "");
		hashMap.put(passwordCheck, "");
		hashMap.put(captcha, yzm);
		sessionStorage.setItem('pass_phone_session', $inputPhoneNumber);
		console.log("验证码请求参数：" + getJsonStr(hashMap));
		return getJsonStr(hashMap);
	}
	function showDialog(){
		//$(".pasOut").show().css("opacity", "0.65");
		//$(".pasInner").show();

		var Components = FFA.namespace('Components');
		var loading = Components.Popup.Loading('A');
	}
	function hideDialog(loading){
		if (loading)
			loading.remove();
		else
			$(".com-popup-loading-a").remove();
		//$(".pasOut").hide().css("opacity", "0.65");
		//$(".pasInner").hide();
	}

	/*找回密码页面输入手机号码后获取验证码*/
	$(".pas-ipt input.pas-one").bind(bind_name, function() {
		var len = $(this).val().length;
		var phonenum = $(".pas-input-phone").val();
		if (len == 11) {
			$(".pas-getYzm").show();
		}
		if (!isMobile(phonenum)) {
			$(".pas-err").css("visibility", "visible");
			$(".pas-sp1").show();
			$(".pas-getYzm").hide();
		} else {
			$(".pas-err").css("visibility", "hidden");
			$(".pas-sp1").hide();
			$(".pas-getYzm").show();
		}
	})

	/*找回密码手机号下一步颜色变化*/
	$(".pas-input-phone").bind(bind_name, function() {
		var phonenum = $(".pas-input-phone").val();
		var yzm = $(".pas-dxyzm").val();
		if (isPhoneNumber(phonenum)) {
			//	$(".error .pas-sp2").css("visibility", "visible");
			//$(".error .pas-sp2").show();
		} else {
			//$(".error .pas-sp2").hide();
		}
	})

	/*找回密码验证码下一步颜色变化*/
	$(".pas-input-yzm").bind(bind_name, function() {
		var phonenum = $(".pas-input-phone").val();
		var yzm = $(".pas-dxyzm").val();
		if (yzm == "") {
			$(".pas-one-style").addClass("ah");
		} else {
			$(".pas-one-style").removeClass("ah");
			$(".error .pas-sp2").hide();
		}
	})

	/*找回密码下一步*/
	$(".pas-next").click(function() {
		if (!$(".pas-one-style").hasClass("ah")) {
			showDialog();
			var phonenum = $(".pas-input-phone").val();
			var yzm = $(".pas-dxyzm").val();
			http_post(newpwd_interface, httpYz(http_find_password_check_verification_code), function(pas_yzm) {
					console.log("找回密码下一步验证成功" + JSON.stringify(pas_yzm));
					hideDialog();//隐藏dialog
					if(pas_yzm.codeInfo==0){
						console.log("success");
						sessionStorage.setItem('pass_yzm_session',yzm);
						window.location.href = "newpasword.html";
						$(".error .pas-sp2").hide();
					}else{
						console.log("fail");
						$(".error .pas-sp2").show();
						$(".error .pas-sp2").css("visibility", "visible");
					}
				},
				function(xhr, e) {
					hideDialog();
					$(".error .pas-sp2").show();
					$(".error .pas-sp2").css("visibility", "visible");
				}
			);
		}
	})

	/*找回密码验证码*/
	$(".yzm2").bind(bind_name, function() {
		var yzm = $(".pas-dxyzm").val();
		if (yzm != "") {
			$(".error .pas-sp2").hide();
		}
	})
	$(".pas-cc").click(function() {
		$(".pascon").hide();
		$('.pas-dxyzm').focus();
	})
	
	/*找回密码验证码对话框消失*/
	$(".password_yzm_dilog_comfim").click(function(){
			$('.password_yzm_dilog').css('display', 'none');
		})
})