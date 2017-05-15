package com.talkingdata.sdk;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.HashMap;
import java.util.Map;

import android.app.Activity;
import android.content.Context;

import com.tendcloud.tenddata.TCAgent;;

public class TalkingDataPlugin extends CordovaPlugin {
	Activity act;
	Context ctx;
	String currPageName;
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		this.act = cordova.getActivity();
		this.ctx = cordova.getActivity().getApplicationContext();
	}
	
	@Override
	public void onResume(boolean multitasking) {
		super.onResume(multitasking);
		TCAgent.onResume(act);
	}
	
	@Override
	public void onPause(boolean multitasking) {
		super.onPause(multitasking);
		TCAgent.onPause(act);
	}
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("init")) {
    		// 初始化 TalkingData Analytics SDK
			String appKey = args.getString(0);
			String channelId = args.getString(1);
			TCAgent.init(ctx, appKey, channelId);
			return true;
		} else if (action.equals("onEvent")) {
    		// 触发自定义事件
			String eventId = args.getString(0);
			TCAgent.onEvent(ctx, eventId);
			return true;
		} else if (action.equals("onEventWithLabel")) {
    		// 触发带事件标签的自定义事件
			String eventId = args.getString(0);
			String eventLabel = args.getString(1);
			TCAgent.onEvent(ctx, eventId, eventLabel);
			return true;
		} else if (action.equals("onEventWithExtraData")) {
    		// 触发带事件标签和更多数据的自定义事件
			String eventId = args.getString(0);
			String eventLabel = args.getString(1);
			String eventDataJson = args.getString(2);
			if (eventDataJson != null) {
				Map<String, Object> eventData = this.toMap(eventDataJson);
				TCAgent.onEvent(ctx, eventId, eventLabel, eventData);
			}
			return true;
		} else if (action.equals("onPage")) {
			// 触发页面事件，在页面加载完毕的时候调用，记录页面名称和使用时长，一个页面调用这个接口后就不用再调用 trackPageBegin 和 trackPageEnd 接口了
			String pageName = args.getString(0);
			// 如果上次记录的页面名称不为空，则本次触发为新页面，触发上一个页面的 onPageEnd
			if (currPageName != null) {
				TCAgent.onPageEnd(act, currPageName);
			}
			// 继续触发本次页面的 onPageBegin 事件
			currPageName = pageName;
			TCAgent.onPageStart(act, currPageName);
			return true;
		} else if (action.equals("onPageBegin")) {
			// 触发页面事件，在页面加载完毕的时候调用，用于记录页面名称和使用时长，和 trackPageEnd 配合使用
			String pageName = args.getString(0);
			currPageName = pageName;
			TCAgent.onPageStart(act, currPageName);
			return true;
		} else if (action.equals("onPageEnd")) {
			// 触发页面事件，在页面加载完毕的时候调用，用于记录页面名称和使用时长，和 trackPageBegin 配合使用
			String pageName = args.getString(0);
			TCAgent.onPageEnd(act, pageName);
			currPageName = null;
			return true;
		} else if (action.equals("getDeviceId")) {
			// 获取 TalkingData Device Id，并将其作为参数传入 JS 的回调函数
			String deviceId = TCAgent.getDeviceId(ctx);
			callbackContext.success(deviceId);
			return true;
		} 
		return false;
	}
	
	private Map<String, Object> toMap(String jsonStr)
	{
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			JSONObject jsonObj = new JSONObject(jsonStr);
			Iterator<String> keys = jsonObj.keys();
			String key = null;
			Object value = null;
			while (keys.hasNext())
			{
				key = keys.next();
				value = jsonObj.get(key);
				result.put(key, value);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return result;
	}
}
