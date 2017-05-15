package com.service.lib;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class ServiceAutoStart extends BroadcastReceiver{

	@Override
	public void onReceive(Context context, Intent intent) {
		// TODO Auto-generated method stub
		String action = intent.getAction();
		if (action.equals(Intent.ACTION_BOOT_COMPLETED)) {
			Log.i("ServiceAutoStart", "onReceive method is called");
			Intent i1 = new Intent(context,Service1.class);
			context.startService(i1);
			Log.i("ServiceAutoStart", "Service1 is started...");
			Intent i2 = new Intent(context,Service2.class);
			context.startService(i2);
			Log.i("ServiceAutoStart", "Service2 is started...");
		}
	}
}
