package com.company.ecommerce.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.company.ecommerce.service.ConfigService;

@Service
public class DefaultConfigService implements ConfigService {

    private final Map<String, String> settings = new HashMap<>();

    public DefaultConfigService() {
        settings.put("shop_name", "Madam Store");
        settings.put("tax_rate", "0.15");
        settings.put("primary_color", "#2c3e50");
        settings.put("font_size", "18px");
        settings.put("contrast_mode", "normal");
    }

    @Override
    public String get(String key) {
        return settings.get(key);
    }

    @Override
    public String get(String key, String defaultValue) {
        return settings.getOrDefault(key, defaultValue);
    }

    @Override
    public void set(String key, String value) {
        settings.put(key, value);
    }

    @Override
    public Map<String, String> getAll() {
        return Collections.unmodifiableMap(settings);
    }
}
