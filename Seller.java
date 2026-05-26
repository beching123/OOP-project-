package com.company.ecommerce.model;

import java.util.ArrayList;
import java.util.List;

public class Seller extends User {

    private String id;
    private String address;
    private String phone;
    private String email;

    private List<Product> products;

    public Seller() {
        products = new ArrayList<>();
    }

    public Seller(String id, String address, String phone, String email) {
        this.id = id;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.products = new ArrayList<>();
    }

    public void login() {
        System.out.println("Seller logged in.");
    }

    public void register() {
        System.out.println("Seller registered.");
    }

    public void updateProfile() {
        System.out.println("Seller profile updated.");
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

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}