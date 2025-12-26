package com.aalts;

import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import androidx.core.app.NotificationManagerCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class NotificationHelper extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    NotificationHelper(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "NotificationHelper";
    }

    @ReactMethod
    public void areNotificationsEnabled(Callback callback) {
        boolean enabled = NotificationManagerCompat.from(reactContext).areNotificationsEnabled();
        callback.invoke(enabled);
    }

    @ReactMethod
    public void openNotificationSettings() {
        Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, reactContext.getPackageName());
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }
}
