package com.company.ecommerce.rest.controller;

import com.company.ecommerce.app.DbConnection;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/staff")
public class StaffController {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public ResponseEntity<?> getStaff(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size) {

        StringBuilder sql = new StringBuilder("SELECT id, username, email, first_name, last_name, phone, roles, permissions, created_at FROM users WHERE roles NOT LIKE '%CUSTOMER%'");
        List<Object> params = new ArrayList<>();

        if (role != null && !role.isEmpty()) {
            sql.append(" AND roles LIKE ?");
            params.add("%" + role.toUpperCase() + "%");
        }
        if (status != null && !status.isEmpty()) {
            if ("active".equalsIgnoreCase(status)) {
                sql.append(" AND permissions != 'disabled'");
            } else if ("inactive".equalsIgnoreCase(status)) {
                sql.append(" AND permissions = 'disabled'");
            }
        }
        sql.append(" ORDER BY id DESC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);

        List<Map<String, Object>> staff = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> row = new java.util.HashMap<>();
                row.put("id", rs.getLong("id"));
                row.put("username", rs.getString("username"));
                row.put("email", rs.getString("email") != null ? rs.getString("email") : "");
                row.put("firstName", rs.getString("first_name") != null ? rs.getString("first_name") : "");
                row.put("lastName", rs.getString("last_name") != null ? rs.getString("last_name") : "");
                row.put("fullName", ((rs.getString("first_name") != null ? rs.getString("first_name") : "") + " " + (rs.getString("last_name") != null ? rs.getString("last_name") : "")).trim());
                row.put("phone", rs.getString("phone") != null ? rs.getString("phone") : "");
                row.put("role", rs.getString("roles"));
                row.put("permissions", rs.getString("permissions"));
                row.put("status", "disabled".equals(rs.getString("permissions")) ? "inactive" : "active");
                row.put("createdAt", rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime().toString() : "");
                staff.add(row);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching staff", e);
        }
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStaffMember(@PathVariable Long id) {
        String sql = "SELECT id, username, email, first_name, last_name, roles, permissions FROM users WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return ResponseEntity.ok(Map.of(
                        "id", rs.getLong("id"),
                        "username", rs.getString("username"),
                        "email", rs.getString("email") != null ? rs.getString("email") : "",
                        "firstName", rs.getString("first_name") != null ? rs.getString("first_name") : "",
                        "lastName", rs.getString("last_name") != null ? rs.getString("last_name") : "",
                        "role", rs.getString("roles"),
                        "permissions", rs.getString("permissions"),
                        "status", "disabled".equals(rs.getString("permissions")) ? "inactive" : "active"
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching staff member", e);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Staff not found"));
    }

    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "");
        String email = body.getOrDefault("email", "");
        String password = body.getOrDefault("password", "");
        String role = body.getOrDefault("role", "CASHIER");
        String firstName = body.getOrDefault("firstName", "");
        String lastName = body.getOrDefault("lastName", "");

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }

        String sql = "INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions) VALUES (?, ?, ?, ?, ?, ?, 'staff')";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, username);
            ps.setString(2, email.isEmpty() ? null : email);
            ps.setString(3, passwordEncoder.encode(password));
            ps.setString(4, firstName.isEmpty() ? null : firstName);
            ps.setString(5, lastName.isEmpty() ? null : lastName);
            ps.setString(6, role.toUpperCase());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                return ResponseEntity.ok(Map.of("id", keys.getLong(1), "username", username, "role", role, "status", "active"));
            }
        } catch (SQLException e) {
            if (e.getMessage().contains("unique")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            throw new RuntimeException("Error creating staff", e);
        }
        return ResponseEntity.status(500).body(Map.of("error", "Failed to create staff"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.getOrDefault("role", "");
        String email = body.getOrDefault("email", "");
        String firstName = body.getOrDefault("firstName", "");
        String lastName = body.getOrDefault("lastName", "");
        StringBuilder sql = new StringBuilder("UPDATE users SET roles = ?");
        List<Object> params = new ArrayList<>();
        params.add(role.toUpperCase());
        if (!email.isEmpty()) {
            sql.append(", email = ?");
            params.add(email);
        }
        if (!firstName.isEmpty()) {
            sql.append(", first_name = ?");
            params.add(firstName);
        }
        if (!lastName.isEmpty()) {
            sql.append(", last_name = ?");
            params.add(lastName);
        }
        sql.append(" WHERE id = ?");
        params.add(id);
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ps.executeUpdate();
            return ResponseEntity.ok(Map.of("id", id, "role", role));
        } catch (SQLException e) {
            throw new RuntimeException("Error updating staff", e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        String sql = "DELETE FROM users WHERE id = ? AND roles NOT LIKE '%CUSTOMER%'";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            int affected = ps.executeUpdate();
            if (affected > 0) {
                return ResponseEntity.ok(Map.of("message", "Staff deleted"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting staff", e);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Staff not found"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "active");
        String permValue = "inactive".equals(status) ? "disabled" : "staff";
        String sql = "UPDATE users SET permissions = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, permValue);
            ps.setLong(2, id);
            ps.executeUpdate();
            return ResponseEntity.ok(Map.of("id", id, "status", status));
        } catch (SQLException e) {
            throw new RuntimeException("Error updating staff status", e);
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.getOrDefault("role", "CASHIER");
        String sql = "UPDATE users SET roles = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, role.toUpperCase());
            ps.setLong(2, id);
            ps.executeUpdate();
            return ResponseEntity.ok(Map.of("id", id, "role", role));
        } catch (SQLException e) {
            throw new RuntimeException("Error updating staff role", e);
        }
    }
}
