package com.company.ecommerce.model;

public class User {

    protected String role;
    protected String loginId;
    protected String password;

    public User() {
    }

    public User(String role, String loginId, String password) {
        this.role = role;
        this.loginId = loginId;
        this.password = password;
    }

    public void verifyLogin() {
        System.out.println("Login verified.");
    }

    // Getters and Setters

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}