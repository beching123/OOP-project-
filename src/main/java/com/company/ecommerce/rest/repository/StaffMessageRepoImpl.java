package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.StaffMessage;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StaffMessageRepoImpl {

    public StaffMessage save(StaffMessage msg) {
        String sql = "INSERT INTO staff_messages (sender_id, sender_name, recipient_id, recipient_name, message) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, msg.getSenderId());
            ps.setString(2, msg.getSenderName());
            ps.setLong(3, msg.getRecipientId());
            ps.setString(4, msg.getRecipientName());
            ps.setString(5, msg.getMessage());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                return new StaffMessage(keys.getLong(1), msg.getSenderId(), msg.getSenderName(), msg.getRecipientId(), msg.getRecipientName(), msg.getMessage(), false, LocalDateTime.now());
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving staff message", e);
        }
        return msg;
    }

    public List<StaffMessage> findConversation(Long userId1, Long userId2, int limit) {
        String sql = "SELECT * FROM staff_messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY id ASC LIMIT ?";
        List<StaffMessage> messages = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId1);
            ps.setLong(2, userId2);
            ps.setLong(3, userId2);
            ps.setLong(4, userId1);
            ps.setInt(5, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                messages.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding conversation", e);
        }
        return messages;
    }

    public List<StaffMessage> findConversations(Long userId) {
        String sql = "SELECT DISTINCT ON (partner_id) * FROM (" +
                "SELECT *, CASE WHEN sender_id = ? THEN recipient_id ELSE sender_id END AS partner_id " +
                "FROM staff_messages WHERE sender_id = ? OR recipient_id = ? " +
                "ORDER BY id DESC) sub ORDER BY partner_id, id DESC";
        List<StaffMessage> messages = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, userId);
            ps.setLong(3, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                messages.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding conversations", e);
        }
        return messages;
    }

    public int countUnread(Long userId) {
        String sql = "SELECT COUNT(*) FROM staff_messages WHERE recipient_id = ? AND is_read = FALSE";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            throw new RuntimeException("Error counting unread messages", e);
        }
        return 0;
    }

    public void markAsRead(Long senderId, Long recipientId) {
        String sql = "UPDATE staff_messages SET is_read = TRUE WHERE sender_id = ? AND recipient_id = ? AND is_read = FALSE";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, senderId);
            ps.setLong(2, recipientId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error marking messages as read", e);
        }
    }

    private StaffMessage mapRow(ResultSet rs) throws SQLException {
        Long id = rs.getLong("id");
        Long senderId = rs.getLong("sender_id");
        String senderName = rs.getString("sender_name");
        Long recipientId = rs.getLong("recipient_id");
        String recipientName = rs.getString("recipient_name");
        String message = rs.getString("message");
        boolean isRead = rs.getBoolean("is_read");
        Timestamp ts = rs.getTimestamp("created_at");
        LocalDateTime createdAt = ts != null ? ts.toLocalDateTime() : null;
        return new StaffMessage(id, senderId, senderName, recipientId, recipientName, message, isRead, createdAt);
    }
}
