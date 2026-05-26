package com.company.ecommerce.model;

public class Payment {

    private String id;
    private String orderID;
    private boolean paid;
    private double total;
    private String details;

    public Payment() {
    }

    public void sendInvoice() {
        System.out.println("Invoice sent.");
    }

    public void confirmTransaction() {
        System.out.println("Transaction confirmed.");
    }

    public void payPayment() {
        System.out.println("Payment processed.");
    }

    public void makeTransaction() {
        System.out.println("Transaction completed.");
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderID() {
        return orderID;
    }

    public void setOrderID(String orderID) {
        this.orderID = orderID;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}