// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.time.LocalDateTime;
// imported type required by this class
import java.util.ArrayList;
// imported type required by this class
import java.util.List;
// imported type required by this class
import java.util.Objects;

/**
 * Order — domain model capturing a customer's purchase.
 *
 * <p>Notes:
 * - `status` uses simple string constants (e.g. DRAFT, PAID, SHIPPED). Business logic should
 *   validate allowed transitions (for example: DRAFT -> PAID -> SHIPPED).
 * - `items` is a defensive copy on access to avoid exposing internal lists.
 * - `version` is used for optimistic locking; repository implementations must honor it to
 *   prevent lost updates when multiple processes update the same order concurrently.
 */
// declare class type for this file
public class Order {
    // field declaration for "DRAFT"
    public static final String STATUS_DRAFT = "DRAFT";
    // field declaration for "PAID"
    public static final String STATUS_PAID = "PAID";
    // field declaration for "VOID"
    public static final String STATUS_VOID = "VOID";
    // field declaration for "SHIPPED"
    public static final String STATUS_SHIPPED = "SHIPPED";
    // field declaration for "PENDING_VERIFICATION"
    public static final String STATUS_PENDING_VERIFICATION = "PENDING_VERIFICATION";

    // field declaration for id
    private Long id;
    // field declaration for status
    private String status;
    // create or update a collection or object
    private List<OrderItem> items = new ArrayList<>();
    // field declaration for total
    private BigDecimal total;
    // field declaration for tax
    private BigDecimal tax;
    // field declaration for customerId
    private Long customerId;
    // field declaration for cashierId
    private Long cashierId;
    // field declaration for createdAt
    private LocalDateTime createdAt;
    // field declaration for version
    private int version;

    // method declaration for Order
    public Order() {
    }

    // method declaration for Order
    public Order(Long id, String status, List<OrderItem> items, BigDecimal total, BigDecimal tax, Long customerId, Long cashierId, LocalDateTime createdAt, int version) {
        // assign value to object field
        this.id = id;
        // assign value to object field
        this.status = status;
        // assign value to object field
        this.items = items == null ? new ArrayList<>() : new ArrayList<>(items);
        // assign value to object field
        this.total = total;
        // assign value to object field
        this.tax = tax;
        // assign value to object field
        this.customerId = customerId;
        // assign value to object field
        this.cashierId = cashierId;
        // assign value to object field
        this.createdAt = createdAt;
        // assign value to object field
        this.version = version;
    }

    // method declaration for getId
    public Long getId() {
        // return statement from method
        return id;
    }

    // method declaration for setId
    public void setId(Long id) {
        // assign value to object field
        this.id = id;
    }

    // method declaration for getStatus
    public String getStatus() {
        // return statement from method
        return status;
    }

    // method declaration for setStatus
    public void setStatus(String status) {
        // assign value to object field
        this.status = status;
    }

    // method declaration for getItems
    public List<OrderItem> getItems() {
        // return statement from method
        return new ArrayList<>(items);
    }

    // method declaration for setItems
    public void setItems(List<OrderItem> items) {
        // assign value to object field
        this.items = items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    // method declaration for getTotal
    public BigDecimal getTotal() {
        // return statement from method
        return total;
    }

    // method declaration for setTotal
    public void setTotal(BigDecimal total) {
        // assign value to object field
        this.total = total;
    }

    // method declaration for getTax
    public BigDecimal getTax() {
        // return statement from method
        return tax;
    }

    // method declaration for setTax
    public void setTax(BigDecimal tax) {
        // assign value to object field
        this.tax = tax;
    }

    // method declaration for getCustomerId
    public Long getCustomerId() {
        // return statement from method
        return customerId;
    }

    // method declaration for setCustomerId
    public void setCustomerId(Long customerId) {
        // assign value to object field
        this.customerId = customerId;
    }

    // method declaration for getCashierId
    public Long getCashierId() {
        // return statement from method
        return cashierId;
    }

    // method declaration for setCashierId
    public void setCashierId(Long cashierId) {
        // assign value to object field
        this.cashierId = cashierId;
    }

    // method declaration for getCreatedAt
    public LocalDateTime getCreatedAt() {
        // return statement from method
        return createdAt;
    }

    // method declaration for setCreatedAt
    public void setCreatedAt(LocalDateTime createdAt) {
        // assign value to object field
        this.createdAt = createdAt;
    }

    // method declaration for getVersion
    public int getVersion() {
        // return statement from method
        return version;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof Order)) return false;
        Order order = (Order) o;
        // return statement from method
        return Objects.equals(id, order.id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
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
