package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class WishlistRepoImpl {

    public List<Map<String, Object>> findByUserId(Long userId) {
        String sql = "SELECT w.id, w.product_id, w.created_at, p.name, p.price, p.image_url, p.stock FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ? ORDER BY w.created_at DESC";
        List<Map<String, Object>> items = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                items.add(Map.of(
                    "id", rs.getLong("id"),
                    "productId", rs.getLong("product_id"),
                    "createdAt", rs.getTimestamp("created_at").toLocalDateTime().toString(),
                    "name", rs.getString("name"),
                    "price", rs.getBigDecimal("price"),
                    "imageUrl", rs.getString("image_url") != null ? rs.getString("image_url") : "",
                    "stock", rs.getInt("stock")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding wishlist", e);
        }
        return items;
    }

    public boolean isWishlisted(Long userId, Long productId) {
        String sql = "SELECT COUNT(*) FROM wishlist WHERE user_id = ? AND product_id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error checking wishlist", e);
        }
        return false;
    }

    public Map<String, Object> add(Long userId, Long productId) {
        String sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING id";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Map.of("id", rs.getLong("id"), "productId", productId);
            }
            return Map.of("productId", productId, "message", "Already in wishlist");
        } catch (SQLException e) {
            throw new RuntimeException("Error adding to wishlist", e);
        }
    }

    public boolean remove(Long userId, Long productId) {
        String sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, productId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error removing from wishlist", e);
        }
    }
}
