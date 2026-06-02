package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.Order;
import com.company.ecommerce.model.OrderItem;
import com.company.ecommerce.persistence.OrderRepo;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepoImpl implements OrderRepo {

    @Override
    public Order save(Order order) {
        if (order.getId() == null) {
            return insert(order);
        } else {
            return updateOrder(order);
        }
    }

    private Order insert(Order order) {
        String sql = "INSERT INTO orders (status, total, tax, subtotal, customer_id, customer_name, cashier_id, payment_method, shipping_address, delivery_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, order.getStatus());
            ps.setBigDecimal(2, order.getTotal());
            ps.setBigDecimal(3, order.getTax());
            ps.setBigDecimal(4, order.getSubtotal());
            ps.setObject(5, order.getCustomerId());
            ps.setString(6, order.getCustomerName());
            ps.setObject(7, order.getCashierId());
            ps.setString(8, order.getPaymentMethod());
            ps.setString(9, order.getShippingAddress());
            ps.setString(10, order.getDeliveryMethod());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                order.setId(keys.getLong(1));
            }

            for (OrderItem item : order.getItems()) {
                String itemSql = "INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, image_url) VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement ips = conn.prepareStatement(itemSql)) {
                    ips.setLong(1, order.getId());
                    ips.setLong(2, item.getProductId());
                    ips.setString(3, item.getProductName());
                    ips.setInt(4, item.getQuantity());
                    ips.setBigDecimal(5, item.getUnitPrice());
                    ips.setString(6, item.getImageUrl());
                    ips.executeUpdate();
                }
            }

            return order;
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting order", e);
        }
    }

    private Order updateOrder(Order order) {
        String sql = "UPDATE orders SET status = ?, total = ?, tax = ?, version = version + 1 WHERE id = ? AND version = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, order.getStatus());
            ps.setBigDecimal(2, order.getTotal());
            ps.setBigDecimal(3, order.getTax());
            ps.setLong(4, order.getId());
            ps.setInt(5, order.getVersion());
            int updated = ps.executeUpdate();
            if (updated == 0) {
                throw new com.company.ecommerce.model.StaleDataException("Order was modified by another process");
            }
            return order;
        } catch (SQLException e) {
            throw new RuntimeException("Error updating order", e);
        }
    }

    @Override
    public void updateDraft(Order order) {
        String sql = "UPDATE orders SET status = ?, total = ?, tax = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, order.getStatus());
            ps.setBigDecimal(2, order.getTotal());
            ps.setBigDecimal(3, order.getTax());
            ps.setLong(4, order.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating draft order", e);
        }
    }

    @Override
    public Optional<Order> findById(Long id) {
        String sql = "SELECT * FROM orders WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Order order = mapRow(rs);
                order.setItems(findItemsByOrderId(conn, id));
                return Optional.of(order);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding order by id", e);
        }
        return Optional.empty();
    }

    public Optional<Order> findByOrderNumber(String orderNumber) {
        String cleanId = orderNumber;
        if (cleanId != null && cleanId.toUpperCase().startsWith("ORD-")) {
            cleanId = cleanId.substring(4);
        }
        try {
            Long id = Long.parseLong(cleanId);
            return findById(id);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    @Override
    public void updateStatus(Long orderId, String status, int version) {
        String sql = "UPDATE orders SET status = ?, version = version + 1 WHERE id = ? AND version = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setLong(2, orderId);
            ps.setInt(3, version);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating order status", e);
        }
    }

    @Override
    public List<Order> findByStatus(String status) {
        String sql = "SELECT * FROM orders WHERE status = ? ORDER BY id DESC";
        List<Order> orders = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                orders.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding orders by status", e);
        }
        return orders;
    }

    public List<Order> findByCustomerId(Long customerId) {
        String sql = "SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC";
        List<Order> orders = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order order = mapRow(rs);
                order.setItems(findItemsByOrderId(conn, order.getId()));
                orders.add(order);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding orders by customer id", e);
        }
        return orders;
    }

    public List<Order> findAll() {
        String sql = "SELECT * FROM orders ORDER BY id DESC";
        List<Order> orders = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                orders.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all orders", e);
        }
        return orders;
    }

    private List<OrderItem> findItemsByOrderId(Connection conn, Long orderId) throws SQLException {
        String sql = "SELECT * FROM order_items WHERE order_id = ?";
        List<OrderItem> items = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                OrderItem item = new OrderItem();
                item.setProductId(rs.getLong("product_id"));
                item.setProductName(rs.getString("product_name"));
                item.setQuantity(rs.getInt("quantity"));
                item.setUnitPrice(rs.getBigDecimal("unit_price"));
                item.setImageUrl(rs.getString("image_url"));
                items.add(item);
            }
        }
        return items;
    }

    private Order mapRow(ResultSet rs) throws SQLException {
        Order order = new Order();
        order.setId(rs.getLong("id"));
        order.setStatus(rs.getString("status"));
        order.setTotal(rs.getBigDecimal("total"));
        order.setTax(rs.getBigDecimal("tax"));
        order.setSubtotal(rs.getBigDecimal("subtotal"));
        order.setCustomerId(rs.getObject("customer_id") != null ? rs.getLong("customer_id") : null);
        order.setCustomerName(rs.getString("customer_name"));
        order.setCashierId(rs.getObject("cashier_id") != null ? rs.getLong("cashier_id") : null);
        order.setPaymentMethod(rs.getString("payment_method"));
        order.setShippingAddress(rs.getString("shipping_address"));
        order.setDeliveryMethod(rs.getString("delivery_method"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            order.setCreatedAt(ts.toLocalDateTime());
        }
        order.setVersion(rs.getInt("version"));
        return order;
    }
}
