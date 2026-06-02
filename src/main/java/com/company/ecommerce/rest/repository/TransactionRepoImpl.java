package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.Transaction;
import com.company.ecommerce.persistence.TransactionRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class TransactionRepoImpl implements TransactionRepo {

    @Override
    public Optional<Transaction> findById(Long id) {
        String sql = "SELECT * FROM transactions WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding transaction by id", e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Transaction> findByPaymentReference(String paymentReference) {
        String sql = "SELECT * FROM transactions WHERE payment_reference = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, paymentReference);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding transaction by payment reference", e);
        }
        return Optional.empty();
    }

    @Override
    public List<Transaction> findByOrderId(Long orderId) {
        String sql = "SELECT * FROM transactions WHERE order_id = ? ORDER BY id DESC";
        List<Transaction> transactions = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                transactions.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding transactions by order id", e);
        }
        return transactions;
    }

    @Override
    public Transaction save(Transaction transaction) {
        if (transaction.getId() == null) {
            return insert(transaction);
        } else {
            return update(transaction);
        }
    }

    private Transaction insert(Transaction transaction) {
        String sql = "INSERT INTO transactions (order_id, amount, gateway, status, payment_reference) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, transaction.getOrderId());
            ps.setBigDecimal(2, transaction.getAmount());
            ps.setString(3, transaction.getGateway());
            ps.setString(4, transaction.getStatus());
            ps.setString(5, transaction.getPaymentReference());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                transaction.setId(keys.getLong(1));
            }
            return transaction;
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting transaction", e);
        }
    }

    private Transaction update(Transaction transaction) {
        String sql = "UPDATE transactions SET status = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, transaction.getStatus());
            ps.setLong(2, transaction.getId());
            ps.executeUpdate();
            return transaction;
        } catch (SQLException e) {
            throw new RuntimeException("Error updating transaction", e);
        }
    }

    private Transaction mapRow(ResultSet rs) throws SQLException {
        Transaction t = new Transaction();
        t.setId(rs.getLong("id"));
        t.setOrderId(rs.getLong("order_id"));
        t.setAmount(rs.getBigDecimal("amount"));
        t.setGateway(rs.getString("gateway"));
        t.setStatus(rs.getString("status"));
        t.setPaymentReference(rs.getString("payment_reference"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            t.setCreatedAt(ts.toLocalDateTime());
        }
        return t;
    }
}
