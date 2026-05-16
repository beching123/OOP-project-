package com.company.ecommerce.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class User {
    private Long id;
    private String username;
    private String passwordHash;
    private List<String> roles = new ArrayList<>();
    private List<String> permissions = new ArrayList<>();

    public User() {
    }

    public User(Long id, String username, String passwordHash, List<String> roles, List<String> permissions) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
        this.permissions = permissions == null ? new ArrayList<>() : new ArrayList<>(permissions);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public List<String> getRoles() {
        return new ArrayList<>(roles);
    }

    public void setRoles(List<String> roles) {
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
    }

    public List<String> getPermissions() {
        return new ArrayList<>(permissions);
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions == null ? new ArrayList<>() : new ArrayList<>(permissions);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", roles=" + roles +
                '}';
    }
}
