package com.company.ecommerce.persistence;

import java.util.Map;
import java.util.Optional;

public interface SettingsRepo {

    Optional<String> findValueByKey(String key);

    Map<String, String> findAll();

    void save(String key, String value);
}
