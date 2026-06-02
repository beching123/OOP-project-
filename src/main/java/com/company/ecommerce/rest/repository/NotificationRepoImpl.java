package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.Notification;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class NotificationRepoImpl {

    public List<Notification> findByUserId(Long userId, int limit) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?";
        List<Notification> notifications = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setInt(2, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                notifications.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding notifications", e);
        }
        return notifications;
    }

    public int countUnread(Long userId) {
        String sql = "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            throw new RuntimeException("Error counting unread notifications", e);
        }
        return 0;
    }

    public Notification save(Notification n) {
        String sql = "INSERT INTO notifications (user_id, title, message, type, reference_id) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, n.getUserId());
            ps.setString(2, n.getTitle());
            ps.setString(3, n.getMessage());
            ps.setString(4, n.getType());
            ps.setObject(5, n.getReferenceId());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                return new Notification(keys.getLong(1), n.getUserId(), n.getTitle(), n.getMessage(), n.getType(), n.getReferenceId(), false, LocalDateTime.now());
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving notification", e);
        }
        return n;
    }

    public void markAsRead(Long id) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error marking notification as read", e);
        }
    }

    public void markAllAsRead(Long userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error marking all notifications as read", e);
        }
    }

    private Notification mapRow(ResultSet rs) throws SQLException {
        Long id = rs.getLong("id");
        Long userId = rs.getLong("user_id");
        String title = rs.getString("title");
        String message = rs.getString("message");
        String type = rs.getString("type");
        Long refId = rs.getObject("reference_id") != null ? rs.getLong("reference_id") : null;
        boolean isRead = rs.getBoolean("is_read");
        Timestamp ts = rs.getTimestamp("created_at");
        LocalDateTime createdAt = ts != null ? ts.toLocalDateTime() : null;
        return new Notification(id, userId, title, message, type, refId, isRead, createdAt);
    }
}
