package com.company.ecommerce.model;

import java.math.BigDecimal;
import java.util.Objects;

public class OrderItem {
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;

    public OrderItem() {
    }

    public OrderItem(Long productId, String productName, int quantity, BigDecimal unitPrice) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderItem)) return false;
        OrderItem orderItem = (OrderItem) o;
        return Objects.equals(productId, orderItem.productId) && Objects.equals(productName, orderItem.productName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, productName);
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                '}';
    }
}
