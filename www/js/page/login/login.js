// 防止穿透
$(function () {
	FastClick.attach(document.body);
});

function optIsRegister() {
	var $pagePhoneNumber = $(".phone").val();
	var $password = $(".pas1").val();
	var $passwordCheck = $(".pas2").val();
	var $captcha = $(".verificationCodeValue").val();
	if (isAllowRegister($pagePhoneNumber, $password, $passwordCheck, $captcha)) {
		$(".zc").removeClass("a2");
		$(".error").css("visibility", "hidden");
	} else {
		$(".zc").addClass("a2");
	}
}

function optIsLogin() {
	var $loginPhoneNum = $(".lgNum").val();
	var $loginPhonePas = $(".lgPas").val();
	if (isAllowLogin($loginPhoneNum, $loginPhonePas)) {
		$(".log").removeClass("a2");
	} else {
		$(".log").addClass("a2");
	}
}

function loginIsHavaNetWork() {
	var netUtils = new NetUtils();
	if (netUtils.isHaveNet()) {
		return true;
	} else {
		register_other_callback("无网络连接，请检查网络设置");
		return false;
	}
}
function login_show_login_page(){
	$(".register").hide();
	$(".login").show();
	$(".tgl-zc").addClass("in-sp1").parent().next().find("span").removeClass("in-sp1");
}
function login_show_register_page(){
	$(".register").show();
	$(".login").hide();
	$(".tgl-zc").removeClass("in-sp1").parent().next().find("span").addClass("in-sp1");
}
function controller_ui(isCancel){
	if(isCancel){
		cancel();
		function cancel(){
			$(".verificationCode").show();
					$(".verificationCode").next().hide();
					window.clearInterval(ti);
					$(this).addClass("a2");
					//$(".regOut").hide().css("opacity", "0.65");
					//$(".regInner").hide();
					// removeLoading();
		}
		return ;
	}
	var time0 = 60;
	function time() {
		$(".register_time").text(time0);
			time0 = time0 - 1;
			if (time0 < 0) {
					cancel();
				};
			}
			
	var ti = window.setInterval(time, 1000);	
}
Zepto(function($) {
	var display_none="none";
	var display_block="block";
	var login_phone_number = get(me_phonenumber);
		//如果注册成功,拿到手机号码显示在登陆页面
		if(isEmpty(login_phone_number)){
			login_show_register_page();
		}else{
			login_show_login_page();
			$(".lgNum").val(login_phone_number);//手机号拦截
			// $(".lgPas")[0].focus();
		}
	if(isPhoneNumber($(".phone").val())){
		//判断验证码页面是否显示，如果显示隐藏
		if(('.getYzm').css('display')==display_none){
      		$(".getYzm").show();
		}
	}

	var bind_name = 'input';
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		bind_name = 'propertychange';
	}
	/*注册页面 手机验证*/
	$(".bod .phone").bind(bind_name, function() {
		optIsRegister();
		var $pagePhoneNumber = $(".phone").val();
		if (isPhoneNumber($pagePhoneNumber)) {
			if (isPhoneNumberEquals($pagePhoneNumber)) {
				$(".error").css("visibility", "hidden");
				$(".error .sp1").hide();
				$(".getYzm").hide();
			} else {
				$(".getYzm").show();
				$(".error .sp1").hide();
			}
		} else {
			$(".error").css("visibility", "visible");
			$(".error .sp1").show();
			$(".getYzm").hide();
		}
	})

	$(".bod .pas1").bind(bind_name, function() {
		var password = $(".pas1").val(); //密码
		optIsRegister();
		if (password != null && password.length >= 8 && password.length <= 20) {
			var $passwordCheck = $(".pas2").val();
			$(".error .sp2").hide();
			if (!isEmpty($passwordCheck)) {
				//如果不为空判断密码是否相等，如果相等的话，隐藏，否则显示
				if (isPassEquals(password, $passwordCheck)) {
					$(".error .sp3").hide();
					$(".verificationCode").removeClass("spn2_hui");
				} else {
					$(".error").css("visibility", "visible");
					$(".verificationCode").addClass("spn2_hui");
					$(".error .sp3").show();
				}
			}
		} else {
			$(".verificationCode").addClass("spn2_hui");
			$(".error .sp2").css("visibility", "visible");
			$(".error .sp2").show();
		}
	})
	$(".bod .pas2").bind(bind_name, function() {
		optIsRegister();
		var $password = $(".pas1").val();
		var $passwordCheck = $(".pas2").val();
		if (isPassEquals($password, $passwordCheck)) {
			$(".error .sp3").hide();
			$(".verificationCode").removeClass("spn2_hui");
		} else {
			$(".error").css("visibility", "visible");
			$(".verificationCode").addClass("spn2_hui");
			$(".error .sp3").show();
		}
	})
	$(".bod .verificationCodeValue").bind(bind_name, function() {
		optIsRegister();
		var $verificationCodeValue = $(".verificationCodeValue").val();
		if (isCaptcha($verificationCodeValue)) {
			$(".error .sp4").hide();
		} else {
			$(".error").css("visibility", "visible");
			$(".error .sp4").show();
		}
	});
	$(".bod .lgNum").bind(bind_name, function() {
		optIsLogin()
	});
	$(".bod .lgPas").bind(bind_name, function() {
		optIsLogin();
	});
	/*点击注册按钮*/
	Zepto(".zc").click(function() {
			cordova.plugins.Keyboard.close();
			if ($(".zc").hasClass("a2")) {
				return;
			}
			if (!loginIsHavaNetWork()) {
				return false;
			}
			var hashMap = new HashMap();
			var $inputPhoneNumber = $(".phone").val();
			var $inputPassword = $(".pas1").val();
			var $inputPassword2 = $(".pas2").val();
			var $inputVerificationCode = $(".verificationCodeValue").val();
			var $deviceUUID = getDeviceUUID();
			var $timetamp = getCurrentTime();
			if (checkPaswordAndPhone($inputPhoneNumber, $inputPassword, $inputPassword2)) {
				$(this).addClass("a2");
				//$(".regOut").show().css("opacity", "0.65");
				//$(".regInner").show();

				// 加载中动画...
				var Components = FFA.namespace('Components');
				Components.Popup.Loading('A');


				hashMap.put(devUUID, $deviceUUID);
				//hashMap.put(userUUID,"");
				hashMap.put(timestamp, $timetamp);
				if (isPhoneNumberEquals($inputPhoneNumber)) {
					hashMap.put(identifying, http_regiter_no_verification_code);
				} else {
					hashMap.put(identifying, http_regiter_have_verification_code);
				}
				hashMap.put(phoneNumber, $inputPhoneNumber);
				hashMap.put(password, $inputPassword);
				hashMap.put(passwordCheck, $inputPassword2);
				if (isEmpty($inputVerificationCode)) {
					hashMap.put(captcha, "");
				} else {
					hashMap.put(captcha, $inputVerificationCode);
				}
				//做网络请求的操作
				http_post(register_interface, getJsonStr(hashMap), register_success, register_fail); //请求网路服务
			}
		});

	/* 验证码  */
	Zepto(".verificationCode").click(function() {
		cordova.plugins.Keyboard.close();
		var $inputPhoneNumber = $(".phone").val();
		if ($(".verificationCode").hasClass("spn2_hui")) {
				return;
		}
		if (!loginIsHavaNetWork()) {
			return false;
		}
		if (isPhoneNumber($inputPhoneNumber)) {
			$(".verificationCode").hide().next().show();
			controller_ui(false);
			var hashMap = new HashMap();
			var $deviceUUID = getDeviceUUID();
			var $timetamp = getCurrentTime();
			hashMap.put(devUUID, $deviceUUID);
			//hashMap.put(userUUID,"");
			hashMap.put(timestamp, $timetamp);
			hashMap.put(identifying, http_regiter_response_verification_code);
			hashMap.put(phoneNumber, $inputPhoneNumber);
			hashMap.put(password, "");
			hashMap.put(passwordCheck, "");
			//进行请求参数获取验证码	
			$(this).addClass("a2");

			//$(".regOut").show().css("opacity", "0.65");
			//$(".regInner").show();

			// 加载中动画...
			var Components = FFA.namespace('Components');
			Components.Popup.Loading('A');

			http_post(register_interface, getJsonStr(hashMap), get_verification_code_success, get_verification_code_fail); //请求网络服务			
		}
	});
	/*点击登陆按钮*/
	Zepto(".log").click(function() {
		cordova.plugins.Keyboard.close();
		if (!loginIsHavaNetWork()) {
			return false;
		}
		var $deviceUUID = getDeviceUUID();
		var loginPhoneNum = $(".lgNum").val();
		var loginPhonePas = $(".lgPas").val();
		if (isPhoneNumber(loginPhoneNum)) { //判断手机号是否为空
			if (isPassword(loginPhonePas)) { //判断密码是否为空
				$(this).addClass("a2");
				//$(".logOut").show().css("opacity", "0.65");
				//$(".logInner").show();

				// 加载中动画...
				var Components = FFA.namespace('Components');
				var loading = Components.Popup.Loading('A');

				var hashMap = new HashMap();
				var currentTimeMillion = getCurrentTime(); //获取当前的时间
				var login_user_uuid = get(user_uuid);
				hashMap.put(devUUID, $deviceUUID);
				//hashMap.put(userUUID,login_user_uuid);
				hashMap.put(timestamp, currentTimeMillion);
				hashMap.put(phoneNumber, loginPhoneNum);
				hashMap.put(password, loginPhonePas);
				hashMap.put(version, getString("version_info"));
				hashMap.put(captcha, "");
       //         console.log("login_interface="+login_interface+",,,getJsonStr(hashMap),"+getJsonStr(hashMap));
				
				http_post(login_interface, getJsonStr(hashMap), login_success, login_fail); //请求网路服务
			}

		}

		//setTimeout(window.location.href='http://10.100.129.57/FFAA/link/frame.html',4);
	})

	/*点击注册按钮*/
	Zepto(".wodL").bind("touchstart", function() {
			cordova.plugins.Keyboard.close();
			login_show_register_page();
		})
		/**点击登录按钮**/
	Zepto(".wodR").bind("touchstart", function() {
		cordova.plugins.Keyboard.close();
		if($('.login').css('display')==display_none){
      		//如果隐藏时的处理方法
		}else{
			 //如果显示时的处理方法
			 return ;
		}
		//if(){}
		var $pagePhoneNumber = $(".phone").val();
		var $password = $(".pas1").val();
		var $passwordCheck = $(".pas2").val();
		//var $passwordCheck = $(".pas2").val();
		if (isAllowLeave($pagePhoneNumber, $password, $passwordCheck)) {
			$(".register").hide();
			$(".login").show();
			$(".tgl-zc").addClass("in-sp1").parent().next().find("span").removeClass("in-sp1");
		} else {
			$(".is_leave .alt").show().css("opacity", "0.65");
			
			$(".is_leave .altW").show();
			$(".is_leave .altW").find("p").text("离开注册页？");
		}
	})

	Zepto(".leave_confirm").click(function() {
		$(".is_leave .alt").hide();
		$(".is_leave .altW").hide();
		login_show_login_page();
		
	});
	Zepto(".leave_cancel").click(function() {
		$(".is_leave .alt").hide();
		$(".is_leave .altW").hide();
	});
	Zepto(".phone_span").click(function() {
		$(this).prev().val('');
		$(this).prev().focus();
		$(".error .sp1").hide();
		//判断验证码页面是否显示，如果显示隐藏
		if($('.getYzm').css('display')==display_none){
      		//如果隐藏时的处理方法
		}else{
			 $(".getYzm").hide();
			 return ;
		}
		
	})
	Zepto(".phone_password").click(function() {
		$(this).prev().val('');
		$(this).prev().focus();
		 $(".pas2").val('')
	})
	Zepto(".register_password_fail_button").click(function() {
		$(".register_password_fail .alt").hide();
		$(".register_password_fail .altW").hide();

	});
	
	//找回密码手机号没注册跳转到注册页面
		var pass_isRegister = sessionStorage.getItem('pass_from');
		if(pass_isRegister){
				$(".register").show();
			  $(".login").hide();
			  $(".tgl-zc").removeClass("in-sp1").parent().next().find("span").addClass("in-sp1");
			}
})