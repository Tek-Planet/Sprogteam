package com.aats;

import android.database.Cursor;
import android.database.CursorWindow;

import com.facebook.react.ReactActivity;

import java.lang.reflect.Field;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SprogTeam";
  }

    Field field;

  {
    try {
      field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
      field.setAccessible(true);
      field.set(null, 100 * 1024 * 1024); //the 100MB is the new size
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
    } catch (IllegalAccessException e) {
      e.printStackTrace();
    }
  }

}
