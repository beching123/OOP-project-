package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.Map;

@Repository
public class PromoCodeRepoImpl {

    public Map<String, Object> findByCode(String code) {
        String sql = "SELECT * FROM promo_codes WHERE code = ? AND is_active = true";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code.toUpperCase());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Map.of(
                    "id", rs.getLong("id"),
                    "code", rs.getString("code"),
                    "description", rs.getString("description") != null ? rs.getString("description") : "",
                    "discountType", rs.getString("discount_type"),
                    "discountValue", rs.getBigDecimal("discount_value"),
                    "minOrder", rs.getBigDecimal("min_order"),
                    "maxUses", rs.getObject("max_uses") != null ? rs.getInt("max_uses") : -1,
                    "usedCount", rs.getInt("used_count")
                );
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding promo code", e);
        }
        return null;
    }

    public boolean validate(String code, java.math.BigDecimal orderTotal) {
        Map<String, Object> promo = findByCode(code);
        if (promo == null) return false;
        java.math.BigDecimal minOrder = (java.math.BigDecimal) promo.get("minOrder");
        Integer maxUses = (Integer) promo.get("maxUses");
        Integer usedCount = (Integer) promo.get("usedCount");
        if (minOrder != null && orderTotal.compareTo(minOrder) < 0) return false;
        if (maxUses != null && maxUses > 0 && usedCount >= maxUses) return false;
        return true;
    }

    public void incrementUsage(String code) {
        String sql = "UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code.toUpperCase());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error incrementing promo usage", e);
        }
    }
}
