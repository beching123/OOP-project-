package com.company.ecommerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Order {
    public static final String STATUS_DRAFT = "DRAFT";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_VOID = "VOID";
    public static final String STATUS_SHIPPED = "SHIPPED";

    private Long id;
    private String status;
    private List<OrderItem> items = new ArrayList<>();
    private BigDecimal total;
    private BigDecimal tax;
    private Long customerId;
    private Long cashierId;
    private LocalDateTime createdAt;
    private int version;

    public Order() {
    }

    public Order(Long id, String status, List<OrderItem> items, BigDecimal total, BigDecimal tax, Long customerId, Long cashierId, LocalDateTime createdAt, int version) {
        this.id = id;
        this.status = status;
        this.items = items == null ? new ArrayList<>() : new ArrayList<>(items);
        this.total = total;
        this.tax = tax;
        this.customerId = customerId;
        this.cashierId = cashierId;
        this.createdAt = createdAt;
        this.version = version;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItem> getItems() {
        return new ArrayList<>(items);
    }

    public void setItems(List<OrderItem> items) {
        this.items = items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getCashierId() {
        return cashierId;
    }

    public void setCashierId(Long cashierId) {
        this.cashierId = cashierId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order)) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", status='" + status + '\'' +
                ", total=" + total +
                ", tax=" + tax +
                ", customerId=" + customerId +
                ", cashierId=" + cashierId +
                ", version=" + version +
                '}';
    }
}
