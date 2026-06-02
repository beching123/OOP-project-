package com.company.ecommerce.rest.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private CustomerInfo customer;
    private DeliveryInfo delivery;
    private PaymentInfo payment;

    public OrderRequest() {}

    public static class OrderItemRequest {
        private Long id;
        private Integer quantity;
        private String variant;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getVariant() { return variant; }
        public void setVariant(String variant) { this.variant = variant; }
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
        private String checkpointId;

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getCheckpointId() { return checkpointId; }
        public void setCheckpointId(String checkpointId) { this.checkpointId = checkpointId; }
    }

    public static class PaymentInfo {
        private String methodId;
        private String phoneNumber;
        private String cardNumber;
        private String cardExpiry;
        private String cardCvv;

        public String getMethodId() { return methodId; }
        public void setMethodId(String methodId) { this.methodId = methodId; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
        public String getCardExpiry() { return cardExpiry; }
        public void setCardExpiry(String cardExpiry) { this.cardExpiry = cardExpiry; }
        public String getCardCvv() { return cardCvv; }
        public void setCardCvv(String cardCvv) { this.cardCvv = cardCvv; }
    }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public CustomerInfo getCustomer() { return customer; }
    public void setCustomer(CustomerInfo customer) { this.customer = customer; }
    public DeliveryInfo getDelivery() { return delivery; }
    public void setDelivery(DeliveryInfo delivery) { this.delivery = delivery; }
    public PaymentInfo getPayment() { return payment; }
    public void setPayment(PaymentInfo payment) { this.payment = payment; }
}
