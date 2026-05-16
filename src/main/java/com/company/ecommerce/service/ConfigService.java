package com.company.ecommerce.service;

import java.util.Map;

public interface ConfigService {

    String get(String key);

    String get(String key, String defaultValue);

    void set(String key, String value);

    Map<String, String> getAll();
}
