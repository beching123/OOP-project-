package com.company.ecommerce.rest.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderId;
    private String trackingNumber;
    private String status;
    private String customerName;
    private String paymentMethod;
    private String createdAt;
    private String estimatedDelivery;
    private List<OrderItemResponse> items;
    private CustomerInfo customer;
    private DeliveryInfo delivery;
    private PaymentInfo payment;
    private OrderTotals totals;

    public OrderResponse() {}

    public static class OrderItemResponse {
        private Long id;
        private String name;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String image;
        private Integer quantity;
        private String variant;
        private BigDecimal lineTotal;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getVariant() { return variant; }
        public void setVariant(String variant) { this.variant = variant; }
        public BigDecimal getLineTotal() { return lineTotal; }
        public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    }

    public static class CustomerInfo {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class DeliveryInfo {
        private String method;
        private String region;
        private String city;
        private String checkpoint;
        private BigDecimal shippingCost;

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getCheckpoint() { return checkpoint; }
        public void setCheckpoint(String checkpoint) { this.checkpoint = checkpoint; }
        public BigDecimal getShippingCost() { return shippingCost; }
        public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }
    }

    public static class PaymentInfo {
        private String method;
        private String methodId;
        private String phone;
        private BigDecimal amount;
        private String status;

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getMethodId() { return methodId; }
        public void setMethodId(String methodId) { this.methodId = methodId; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class OrderTotals {
        private BigDecimal subtotal;
        private BigDecimal savings;
        private BigDecimal discountedSubtotal;
        private BigDecimal shippingCost;
        private BigDecimal total;

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
        public BigDecimal getSavings() { return savings; }
        public void setSavings(BigDecimal savings) { this.savings = savings; }
        public BigDecimal getDiscountedSubtotal() { return discountedSubtotal; }
        public void setDiscountedSubtotal(BigDecimal discountedSubtotal) { this.discountedSubtotal = discountedSubtotal; }
        public BigDecimal getShippingCost() { return shippingCost; }
        public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }
        public BigDecimal getTotal() { return total; }
        public void setTotal(BigDecimal total) { this.total = total; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
    public CustomerInfo getCustomer() { return customer; }
    public void setCustomer(CustomerInfo customer) { this.customer = customer; }
    public DeliveryInfo getDelivery() { return delivery; }
    public void setDelivery(DeliveryInfo delivery) { this.delivery = delivery; }
    public PaymentInfo getPayment() { return payment; }
    public void setPayment(PaymentInfo payment) { this.payment = payment; }
    public OrderTotals getTotals() { return totals; }
    public void setTotals(OrderTotals totals) { this.totals = totals; }
}
