package com.creditease.ffa.extrainfo;

import java.util.TimeZone;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;


public class ExtraInfo extends CordovaPlugin {

	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) 
			throws JSONException {
		Activity activity = this.cordova.getActivity();
		TelephonyManager systemService = (TelephonyManager)activity.getSystemService(Context.TELEPHONY_SERVICE);
		if (action.equals("getImei")) {
			String imei = "";
			imei = systemService.getDeviceId();
			if(TextUtils.isEmpty(imei)) {
				callbackContext.error("");
			} else {
				callbackContext.success(imei);
			}
			return true;
		} else if (action.equals("getSim1Number")){
			String sim1Number = "";
			sim1Number = systemService.getLine1Number();
			if(TextUtils.isEmpty(sim1Number)) {
				callbackContext.error("");
			} else {
				callbackContext.success(sim1Number);
			}
			return true;
		}
		return false;
	}
}
