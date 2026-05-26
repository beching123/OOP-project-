package com.company.ecommerce.model;

import java.util.ArrayList;
import java.util.List;

public class ShoppingCart {

    private String createdDate;
    private List<Product> products;

    public ShoppingCart() {
        products = new ArrayList<>();
    }

    public void addCartItem(Product product) {
        products.add(product);
    }

    public void checkout() {
        System.out.println("Checkout completed.");
    }

    public void viewCartDetails() {
        System.out.println("Viewing cart details.");
    }

    public void updateQuantity() {
        System.out.println("Cart quantity updated.");
    }

    // Getters and Setters

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}