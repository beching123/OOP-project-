package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class AddressRepoImpl {

    public List<Map<String, Object>> findByUserId(Long userId) {
        String sql = "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC";
        List<Map<String, Object>> addresses = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                addresses.add(Map.of(
                    "id", rs.getLong("id"),
                    "label", rs.getString("label"),
                    "fullName", rs.getString("full_name") != null ? rs.getString("full_name") : "",
                    "phone", rs.getString("phone") != null ? rs.getString("phone") : "",
                    "addressLine1", rs.getString("address_line1"),
                    "addressLine2", rs.getString("address_line2") != null ? rs.getString("address_line2") : "",
                    "city", rs.getString("city"),
                    "region", rs.getString("region"),
                    "isDefault", rs.getBoolean("is_default")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding addresses", e);
        }
        return addresses;
    }

    public Map<String, Object> save(Long userId, Map<String, String> body) {
        String label = body.getOrDefault("label", "Home");
        String fullName = body.getOrDefault("fullName", "");
        String phone = body.getOrDefault("phone", "");
        String addressLine1 = body.getOrDefault("addressLine1", "");
        String addressLine2 = body.getOrDefault("addressLine2", "");
        String city = body.getOrDefault("city", "");
        String region = body.getOrDefault("region", "");
        boolean isDefault = Boolean.parseBoolean(body.getOrDefault("isDefault", "false"));

        if (isDefault) {
            clearDefault(userId);
        }

        String sql = "INSERT INTO addresses (user_id, label, full_name, phone, address_line1, address_line2, city, region, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setString(2, label);
            ps.setString(3, fullName);
            ps.setString(4, phone);
            ps.setString(5, addressLine1);
            ps.setString(6, addressLine2);
            ps.setString(7, city);
            ps.setString(8, region);
            ps.setBoolean(9, isDefault);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Map.of("id", rs.getLong("id"), "label", label, "city", city, "region", region, "isDefault", isDefault);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving address", e);
        }
        return Map.of("error", "Failed to save address");
    }

    public boolean delete(Long userId, Long addressId) {
        String sql = "DELETE FROM addresses WHERE id = ? AND user_id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, addressId);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting address", e);
        }
    }

    private void clearDefault(Long userId) {
        String sql = "UPDATE addresses SET is_default = false WHERE user_id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error clearing default address", e);
        }
    }
}
