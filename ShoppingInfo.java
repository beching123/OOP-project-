package com.company.ecommerce.model;

public class ShoppingInfo {

    private String shippingId;
    private double shippingCost;
    private String shippingType;
    private String shippingRegion;

    public ShoppingInfo() {
    }

    public void updateShippingInfo() {
        System.out.println("Shipping information updated.");
    }

    // Getters and Setters

    public String getShippingId() {
        return shippingId;
    }

    public void setShippingId(String shippingId) {
        this.shippingId = shippingId;
    }

    public double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public String getShippingType() {
        return shippingType;
    }

    public void setShippingType(String shippingType) {
        this.shippingType = shippingType;
    }

    public String getShippingRegion() {
        return shippingRegion;
    }

    public void setShippingRegion(String shippingRegion) {
        this.shippingRegion = shippingRegion;
    }
}