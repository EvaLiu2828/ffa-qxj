package com.creditease.ffa.strongservice;

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
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;


public class StrongService extends CordovaPlugin {

	private static final String SERVICE1_INTENT = "com.service.lib.STARTSERVICE1";
	private static final String SERVICE2_INTENT = "com.service.lib.STARTSERVICE2";

	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) 
			throws JSONException {
		Activity activity = this.cordova.getActivity();
		if (action.equals("startStrongService")) {
			Intent intentEncode = new Intent(SERVICE1_INTENT);
			intentEncode.addCategory(Intent.CATEGORY_DEFAULT);
			// avoid calling other apps
			intentEncode.setPackage(activity.getApplicationContext().getPackageName());
			activity.startService(intentEncode);
			Intent intentEncode2 = new Intent(SERVICE2_INTENT);
			intentEncode2.addCategory(Intent.CATEGORY_DEFAULT);
			intentEncode.setPackage(activity.getApplicationContext().getPackageName());
			activity.startService(intentEncode2);
			callbackContext.success("0");
			/* this.cordova.getThreadPool().execute(new Runnable() {
				public void run() {
					//Activity activity = this.cordova.getActivity();
					Intent intentEncode = new Intent(SERVICE1_INTENT);
					intentEncode.addCategory(Intent.CATEGORY_DEFAULT);
					// avoid calling other apps
					intentEncode.setPackage(activity.getApplicationContext().getPackageName());
					activity.startService(intentEncode);
					Intent intentEncode2 = new Intent(SERVICE2_INTENT);
					intentEncode2.addCategory(Intent.CATEGORY_DEFAULT);
					intentEncode.setPackage(activity.getApplicationContext().getPackageName());
					activity.startService(intentEncode2);
					//callbackContext.success("0");
				}
			}); */
			return true;
		}
		return false;
	}
}
