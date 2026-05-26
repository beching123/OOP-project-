package com.company.ecommerce.model;

import java.util.ArrayList;
import java.util.List;

public class Customer extends User {

    private String id;
    private String address;
    private String phone;
    private String email;

    private ShoppingCart shoppingCart;
    private List<Order> orders;

    public Customer() {
        orders = new ArrayList<>();
    }

    public Customer(String id, String address, String phone, String email) {
        this.id = id;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.orders = new ArrayList<>();
    }

    public void login() {
        System.out.println("Customer logged in.");
    }

    public void register() {
        System.out.println("Customer registered.");
    }

    public void updateProfile() {
        System.out.println("Customer profile updated.");
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ShoppingCart getShoppingCart() {
        return shoppingCart;
    }

    public void setShoppingCart(ShoppingCart shoppingCart) {
        this.shoppingCart = shoppingCart;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}