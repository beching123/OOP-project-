package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.Admin;
import com.company.ecommerce.model.Cashier;
import com.company.ecommerce.model.Customer;
import com.company.ecommerce.model.User;
import com.company.ecommerce.persistence.UserRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepoImpl implements UserRepo {

    @Override
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding user by username", e);
        }
        return Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding user by email", e);
        }
        return Optional.empty();
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding user by id", e);
        }
        return Optional.empty();
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            return insert(user);
        } else {
            return update(user);
        }
    }

    private User insert(User user) {
        String sql = "INSERT INTO users (username, email, password_hash, first_name, last_name, phone, roles, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            ps.setString(6, user.getPhone());
            ps.setString(7, String.join(",", user.getRoles()));
            ps.setString(8, String.join(",", user.getPermissions()));
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                user.setId(keys.getLong(1));
            }
            return user;
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting user", e);
        }
    }

    private User update(User user) {
        String sql = "UPDATE users SET username = ?, email = ?, password_hash = ?, first_name = ?, last_name = ?, phone = ?, roles = ?, permissions = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            ps.setString(6, user.getPhone());
            ps.setString(7, String.join(",", user.getRoles()));
            ps.setString(8, String.join(",", user.getPermissions()));
            ps.setLong(9, user.getId());
            ps.executeUpdate();
            return user;
        } catch (SQLException e) {
            throw new RuntimeException("Error updating user", e);
        }
    }

    @Override
    public void updatePassword(Long userId, String newPasswordHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newPasswordHash);
            ps.setLong(2, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating password", e);
        }
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM users";
        List<User> users = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                users.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all users", e);
        }
        return users;
    }

    private User mapRow(ResultSet rs) throws SQLException {
        String rolesStr = rs.getString("roles");
        List<String> roles = new ArrayList<>();
        if (rolesStr != null && !rolesStr.isEmpty()) {
            for (String r : rolesStr.split(",")) {
                roles.add(r.trim());
            }
        }

        String permsStr = rs.getString("permissions");
        List<String> permissions = new ArrayList<>();
        if (permsStr != null && !permsStr.isEmpty()) {
            for (String p : permsStr.split(",")) {
                permissions.add(p.trim());
            }
        }

        String type = roles.contains("ADMIN") ? "ADMIN" :
                      roles.contains("CASHIER") ? "CASHIER" : "CUSTOMER";

        User user;
        switch (type) {
            case "ADMIN":
                user = new Admin();
                break;
            case "CASHIER":
                user = new Cashier();
                break;
            default:
                user = new Customer();
                break;
        }

        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setPhone(rs.getString("phone"));
        user.setLocation(rs.getString("location"));
        user.setAvatar(rs.getString("avatar"));
        user.setRoles(roles);
        user.setPermissions(permissions);
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            user.setCreatedAt(ts.toLocalDateTime());
        }
        return user;
    }
}
