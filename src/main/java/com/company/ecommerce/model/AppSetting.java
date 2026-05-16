package com.company.ecommerce.model;

import java.util.Objects;

public class AppSetting {
    private String key;
    private String value;

    public AppSetting() {
    }

    public AppSetting(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppSetting)) return false;
        AppSetting that = (AppSetting) o;
        return Objects.equals(key, that.key);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key);
    }

    @Override
    public String toString() {
        return "AppSetting{" +
                "key='" + key + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
