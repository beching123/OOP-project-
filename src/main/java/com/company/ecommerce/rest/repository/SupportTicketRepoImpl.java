package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.SupportTicket;
import com.company.ecommerce.persistence.SupportTicketRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class SupportTicketRepoImpl implements SupportTicketRepo {

    @Override
    public Optional<SupportTicket> findById(Long id) {
        String sql = "SELECT * FROM support_tickets WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                SupportTicket ticket = mapRow(rs);
                ticket.setReplies(findRepliesByTicketId(conn, id));
                return Optional.of(ticket);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding ticket by id", e);
        }
        return Optional.empty();
    }

    @Override
    public List<SupportTicket> findAll() {
        String sql = "SELECT * FROM support_tickets ORDER BY id DESC";
        List<SupportTicket> tickets = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                tickets.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all tickets", e);
        }
        return tickets;
    }

    @Override
    public List<SupportTicket> findByCustomerId(Long customerId) {
        String sql = "SELECT * FROM support_tickets WHERE customer_id = ? ORDER BY id DESC";
        List<SupportTicket> tickets = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                tickets.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding tickets by customer id", e);
        }
        return tickets;
    }

    @Override
    public List<SupportTicket> findByStatus(String status) {
        String sql = "SELECT * FROM support_tickets WHERE status = ? ORDER BY id DESC";
        List<SupportTicket> tickets = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                tickets.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding tickets by status", e);
        }
        return tickets;
    }

    @Override
    public SupportTicket save(SupportTicket ticket) {
        if (ticket.getId() == null) {
            return insert(ticket);
        } else {
            return update(ticket);
        }
    }

    private SupportTicket insert(SupportTicket ticket) {
        String sql = "INSERT INTO support_tickets (subject, message, status, priority, customer_id, customer_name, customer_email, order_number, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, ticket.getSubject());
            ps.setString(2, ticket.getMessage());
            ps.setString(3, ticket.getStatus());
            ps.setString(4, ticket.getPriority());
            ps.setLong(5, ticket.getCustomerId());
            ps.setString(6, ticket.getCustomerName());
            ps.setString(7, ticket.getCustomerEmail());
            ps.setString(8, ticket.getOrderNumber());
            ps.setString(9, ticket.getCategory());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                ticket.setId(keys.getLong(1));
            }

            String replySql = "INSERT INTO ticket_replies (ticket_id, message, author, author_role) VALUES (?, ?, ?, ?)";
            for (SupportTicket.Reply reply : ticket.getReplies()) {
                try (PreparedStatement rps = conn.prepareStatement(replySql)) {
                    rps.setLong(1, ticket.getId());
                    rps.setString(2, reply.getMessage());
                    rps.setString(3, reply.getAuthor());
                    rps.setString(4, reply.getAuthorRole());
                    rps.executeUpdate();
                }
            }

            return ticket;
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting ticket", e);
        }
    }

    private SupportTicket update(SupportTicket ticket) {
        String sql = "UPDATE support_tickets SET status = ?, staff_id = ?, staff_name = ?, updated_at = NOW() WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, ticket.getStatus());
            ps.setObject(2, ticket.getStaffId());
            ps.setString(3, ticket.getStaffName());
            ps.setLong(4, ticket.getId());
            ps.executeUpdate();
            return ticket;
        } catch (SQLException e) {
            throw new RuntimeException("Error updating ticket", e);
        }
    }

    @Override
    public void updateStatus(Long id, String status) {
        String sql = "UPDATE support_tickets SET status = ?, updated_at = NOW() WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setLong(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating ticket status", e);
        }
    }

    @Override
    public void assignStaff(Long id, Long staffId, String staffName) {
        String sql = "UPDATE support_tickets SET staff_id = ?, staff_name = ?, status = 'in_progress' WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, staffId);
            ps.setString(2, staffName);
            ps.setLong(3, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error assigning staff to ticket", e);
        }
    }

    @Override
    public void addReply(Long ticketId, SupportTicket.Reply reply) {
        String sql = "INSERT INTO ticket_replies (ticket_id, message, author, author_role) VALUES (?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, ticketId);
            ps.setString(2, reply.getMessage());
            ps.setString(3, reply.getAuthor());
            ps.setString(4, reply.getAuthorRole());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                reply.setId(keys.getLong(1));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error adding reply to ticket", e);
        }
    }

    private List<SupportTicket.Reply> findRepliesByTicketId(Connection conn, Long ticketId) throws SQLException {
        String sql = "SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY id ASC";
        List<SupportTicket.Reply> replies = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, ticketId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                SupportTicket.Reply reply = new SupportTicket.Reply();
                reply.setId(rs.getLong("id"));
                reply.setMessage(rs.getString("message"));
                reply.setAuthor(rs.getString("author"));
                reply.setAuthorRole(rs.getString("author_role"));
                Timestamp ts = rs.getTimestamp("created_at");
                if (ts != null) {
                    reply.setCreatedAt(ts.toLocalDateTime());
                }
                replies.add(reply);
            }
        }
        return replies;
    }

    private SupportTicket mapRow(ResultSet rs) throws SQLException {
        SupportTicket t = new SupportTicket();
        t.setId(rs.getLong("id"));
        t.setSubject(rs.getString("subject"));
        t.setMessage(rs.getString("message"));
        t.setStatus(rs.getString("status"));
        t.setPriority(rs.getString("priority"));
        t.setCustomerId(rs.getLong("customer_id"));
        t.setCustomerName(rs.getString("customer_name"));
        t.setCustomerEmail(rs.getString("customer_email"));
        Long staffId = rs.getObject("staff_id") != null ? rs.getLong("staff_id") : null;
        t.setStaffId(staffId);
        t.setStaffName(rs.getString("staff_name"));
        t.setOrderNumber(rs.getString("order_number"));
        t.setCategory(rs.getString("category"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            t.setCreatedAt(ts.toLocalDateTime());
        }
        Timestamp updated = rs.getTimestamp("updated_at");
        if (updated != null) {
            t.setUpdatedAt(updated.toLocalDateTime());
        }
        return t;
    }
}
