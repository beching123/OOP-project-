// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.util.Objects;

/**
 * AppSetting — simple key/value configuration stored in the database.
 *
 * <p>Use this for lightweight runtime-configurable options. Consider caching reads in the
 * service layer for performance-sensitive settings.
 */
// declare class type for this file
public class AppSetting {
    // field declaration for key
    private String key;
    // field declaration for value
    private String value;

    // method declaration for AppSetting
    public AppSetting() {
    }

    // method declaration for AppSetting
    public AppSetting(String key, String value) {
        // assign value to object field
        this.key = key;
        // assign value to object field
        this.value = value;
    }

    // method declaration for getKey
    public String getKey() {
        // return statement from method
        return key;
    }

    // method declaration for setKey
    public void setKey(String key) {
        // assign value to object field
        this.key = key;
    }

    // method declaration for getValue
    public String getValue() {
        // return statement from method
        return value;
    }

    // method declaration for setValue
    public void setValue(String value) {
        // assign value to object field
        this.value = value;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof AppSetting)) return false;
        AppSetting that = (AppSetting) o;
        // return statement from method
        return Objects.equals(key, that.key);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(key);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return "AppSetting{" +
                "key='" + key + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
