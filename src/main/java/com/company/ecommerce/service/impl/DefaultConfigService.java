// package declaration for this source file
package com.company.ecommerce.service.impl;

// imported type required by this class
import java.util.Collections;
// imported type required by this class
import java.util.HashMap;
// imported type required by this class
import java.util.Map;

// imported type required by this class
import org.springframework.stereotype.Service;

// imported type required by this class
import com.company.ecommerce.service.ConfigService;

/**
 * DefaultConfigService — in-memory application settings provider.
 *
 * <p>This stub implementation is useful for development and demo mode. In production,
 * replace it with a database-backed or cloud configuration implementation.
 */
@Service
public class DefaultConfigService implements ConfigService {

    // create or update a collection or object
    private final Map<String, String> settings = new HashMap<>();

    // method declaration for DefaultConfigService
    public DefaultConfigService() {
        settings.put("shop_name", "Madam Store");
        settings.put("tax_rate", "0.15");
        settings.put("primary_color", "#2c3e50");
        settings.put("font_size", "18px");
        settings.put("contrast_mode", "normal");
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for get
    public String get(String key) {
        // return statement from method
        return settings.get(key);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for get
    public String get(String key, String defaultValue) {
        // return statement from method
        return settings.getOrDefault(key, defaultValue);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for set
    public void set(String key, String value) {
        settings.put(key, value);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getAll
    public Map<String, String> getAll() {
        // return statement from method
        return Collections.unmodifiableMap(settings);
    }
}
