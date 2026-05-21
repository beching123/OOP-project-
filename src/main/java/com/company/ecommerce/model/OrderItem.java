// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.util.Objects;

/**
 * OrderItem — small value object representing a single line in an `Order`.
 *
 * <p>This class intentionally keeps only the necessary information needed for order
 * processing and auditing: `productId`, `productName`, `quantity`, and `unitPrice`.
 * Implementations that require product snapshotting for historical records should copy
 * additional attributes at the time the order is created.
 */
// declare class type for this file
public class OrderItem {
    // field declaration for productId
    private Long productId;
    // field declaration for productName
    private String productName;
    // field declaration for quantity
    private int quantity;
    // field declaration for unitPrice
    private BigDecimal unitPrice;

    // method declaration for OrderItem
    public OrderItem() {
    }

    // method declaration for OrderItem
    public OrderItem(Long productId, String productName, int quantity, BigDecimal unitPrice) {
        // assign value to object field
        this.productId = productId;
        // assign value to object field
        this.productName = productName;
        // assign value to object field
        this.quantity = quantity;
        // assign value to object field
        this.unitPrice = unitPrice;
    }

    // method declaration for getProductId
    public Long getProductId() {
        // return statement from method
        return productId;
    }

    // method declaration for setProductId
    public void setProductId(Long productId) {
        // assign value to object field
        this.productId = productId;
    }

    // method declaration for getProductName
    public String getProductName() {
        // return statement from method
        return productName;
    }

    // method declaration for setProductName
    public void setProductName(String productName) {
        // assign value to object field
        this.productName = productName;
    }

    // method declaration for getQuantity
    public int getQuantity() {
        // return statement from method
        return quantity;
    }

    // method declaration for setQuantity
    public void setQuantity(int quantity) {
        // assign value to object field
        this.quantity = quantity;
    }

    // method declaration for getUnitPrice
    public BigDecimal getUnitPrice() {
        // return statement from method
        return unitPrice;
    }

    // method declaration for setUnitPrice
    public void setUnitPrice(BigDecimal unitPrice) {
        // assign value to object field
        this.unitPrice = unitPrice;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof OrderItem)) return false;
        OrderItem orderItem = (OrderItem) o;
        // return statement from method
        return Objects.equals(productId, orderItem.productId) && Objects.equals(productName, orderItem.productName);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(productId, productName);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return "OrderItem{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                '}';
    }
}
