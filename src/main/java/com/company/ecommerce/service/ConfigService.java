// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import java.util.Map;

/**
 * ConfigService — runtime application configuration storage and retrieval.
 *
 * <p>Use this for small key/value settings stored in the database. Cache values at the
 * service layer for high-read scenarios.
 */
public interface ConfigService {

    /**
     * Get the value for `key` or null if not present.
     */
    String get(String key);

    /**
     * Get the value for `key` or `defaultValue` when missing.
     */
    String get(String key, String defaultValue);

    /**
     * Set or update a configuration value.
     */
    void set(String key, String value);

    /**
     * Return all configuration as a map.
     */
    Map<String, String> getAll();
}
