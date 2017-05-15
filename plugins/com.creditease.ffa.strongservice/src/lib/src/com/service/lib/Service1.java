package com.service.lib;

import java.util.List;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.Service;
import android.app.ActivityManager.RunningServiceInfo;
import android.content.ComponentCallbacks;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.res.Configuration;
import android.os.Handler;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

/**
 * 
 * @author 
 * 
 */
public class Service1 extends Service {

	private String TAG = getClass().getName();
	private String Process_Name = "com.service.strongservicelib:service2";

	/**
	 *Service2 
	 */
	private StrongService startS2 = new StrongService.Stub() {
		@Override
		public void stopService() throws RemoteException {
			Intent i = new Intent(getBaseContext(), Service2.class);
			getBaseContext().stopService(i);
		}

		@Override
		public void startService() throws RemoteException {
			Intent i = new Intent(getBaseContext(), Service2.class);
			getBaseContext().startService(i);
		}
	};

	@Override
	public void onTrimMemory(int level){
		/* Toast.makeText(getBaseContext(), "Service1 onTrimMemory..."+level, Toast.LENGTH_SHORT)
		.show(); */
		
		keepService2();
		
	}

	@Override
	public void onCreate() {
		/* Toast.makeText(Service1.this, "Service1 onCreate...", Toast.LENGTH_SHORT)
				.show(); */
		keepService2();
	}

	/**
	 * 
	 */
	private  void keepService2(){
		boolean isRun = Utils.isProessRunning(Service1.this, Process_Name);
		if (isRun == false) {
			try {
				//Toast.makeText(getBaseContext(), "重新启动 Service2", Toast.LENGTH_SHORT).show();
				startS2.startService();
			} catch (RemoteException e) {
				e.printStackTrace();
			}
		}
	}
	
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		return START_STICKY;
	}

	@Override
	public IBinder onBind(Intent intent) {
		return (IBinder) startS2;
	}

	@Override  
	public void onDestroy() {  
		// TODO Auto-generated method stub
		keepService2();
		super.onDestroy();
	}
}
