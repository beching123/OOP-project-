package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.persistence.SettingsRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class SettingsRepoImpl implements SettingsRepo {

    @Override
    public Optional<String> findValueByKey(String key) {
        String sql = "SELECT value FROM app_settings WHERE key = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, key);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(rs.getString("value"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding setting by key", e);
        }
        return Optional.empty();
    }

    @Override
    public Map<String, String> findAll() {
        String sql = "SELECT * FROM app_settings";
        Map<String, String> settings = new HashMap<>();
        try (Connection conn = DbConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                settings.put(rs.getString("key"), rs.getString("value"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all settings", e);
        }
        return settings;
    }

    @Override
    public void save(String key, String value) {
        String sql = "INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, key);
            ps.setString(2, value);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error saving setting", e);
        }
    }
}
