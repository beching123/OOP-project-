package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.AuditRecord;
import com.company.ecommerce.persistence.AuditRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AuditRepoImpl implements AuditRepo {

    @Override
    public void save(AuditRecord record) {
        String sql = "INSERT INTO audit_records (user_id, user_username, action, details, order_id) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, record.getUserId());
            ps.setString(2, record.getUserUsername());
            ps.setString(3, record.getAction());
            ps.setString(4, record.getDetails());
            ps.setObject(5, record.getOrderId());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error saving audit record", e);
        }
    }

    @Override
    public List<AuditRecord> findRecent(int limit) {
        String sql = "SELECT * FROM audit_records ORDER BY id DESC LIMIT ?";
        List<AuditRecord> records = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                records.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding recent audit records", e);
        }
        return records;
    }

    @Override
    public List<AuditRecord> findByFilter(LocalDateTime from, LocalDateTime to, Long userId, String action) {
        StringBuilder sql = new StringBuilder("SELECT * FROM audit_records WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (from != null) {
            sql.append(" AND timestamp >= ?");
            params.add(Timestamp.valueOf(from));
        }
        if (to != null) {
            sql.append(" AND timestamp <= ?");
            params.add(Timestamp.valueOf(to));
        }
        if (userId != null) {
            sql.append(" AND user_id = ?");
            params.add(userId);
        }
        if (action != null) {
            sql.append(" AND action = ?");
            params.add(action);
        }
        sql.append(" ORDER BY id DESC");

        List<AuditRecord> records = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                records.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding audit records by filter", e);
        }
        return records;
    }

    private AuditRecord mapRow(ResultSet rs) throws SQLException {
        Long id = rs.getLong("id");
        Timestamp ts = rs.getTimestamp("timestamp");
        LocalDateTime timestamp = ts != null ? ts.toLocalDateTime() : null;
        Long userId = rs.getLong("user_id");
        String userUsername = rs.getString("user_username");
        String action = rs.getString("action");
        String details = rs.getString("details");
        Long orderId = rs.getObject("order_id") != null ? rs.getLong("order_id") : null;
        return new AuditRecord(id, timestamp, userId, userUsername, action, details, orderId);
    }
}
