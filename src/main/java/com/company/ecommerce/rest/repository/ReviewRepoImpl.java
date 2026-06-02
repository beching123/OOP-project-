package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ReviewRepoImpl {

    public List<Map<String, Object>> findByProductId(Long productId) {
        String sql = "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC";
        List<Map<String, Object>> reviews = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                reviews.add(Map.of(
                    "id", rs.getLong("id"),
                    "userId", rs.getLong("user_id"),
                    "userName", rs.getString("user_name") != null ? rs.getString("user_name") : "Anonymous",
                    "rating", rs.getInt("rating"),
                    "title", rs.getString("title") != null ? rs.getString("title") : "",
                    "message", rs.getString("message") != null ? rs.getString("message") : "",
                    "createdAt", rs.getTimestamp("created_at").toLocalDateTime().toString()
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding reviews", e);
        }
        return reviews;
    }

    public Map<String, Object> save(Long userId, Long productId, String userName, int rating, String title, String message) {
        String sql = "INSERT INTO reviews (product_id, user_id, user_name, rating, title, message) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (product_id, user_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, message = EXCLUDED.message RETURNING id";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            ps.setLong(2, userId);
            ps.setString(3, userName);
            ps.setInt(4, rating);
            ps.setString(5, title);
            ps.setString(6, message);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Map.of("id", rs.getLong("id"), "productId", productId, "rating", rating);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving review", e);
        }
        return Map.of("error", "Failed to save review");
    }

    public Map<String, Object> getStats(Long productId) {
        String sql = "SELECT COUNT(*) as count, COALESCE(AVG(rating), 0) as avg_rating FROM reviews WHERE product_id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Map.of("count", rs.getInt("count"), "averageRating", rs.getDouble("avg_rating"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error getting review stats", e);
        }
        return Map.of("count", 0, "averageRating", 0.0);
    }
}
