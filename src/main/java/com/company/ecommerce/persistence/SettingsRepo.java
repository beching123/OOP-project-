// package declaration for this source file
package com.company.ecommerce.persistence;

// imported type required by this class
import java.util.Map;
// imported type required by this class
import java.util.Optional;

/**
 * SettingsRepo — persistence contract for application configuration values.
 *
 * <p>Settings are stored as key/value pairs and may be cached by higher-level services.
 */
public interface SettingsRepo {

    /**
     * Find a configuration value by key.
     */
    Optional<String> findValueByKey(String key);

    /**
     * Return all stored configuration values.
     */
    Map<String, String> findAll();

    /**
     * Save or update a configuration entry.
     */
    void save(String key, String value);
}
