// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.util.ArrayList;
// imported type required by this class
import java.util.List;
// imported type required by this class
import java.util.Objects;

/**
 * User — abstract base class for all authenticated system actors.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class represents the shared identity fields for users, employees, and customers.
 * It defines the minimal contract for authentication, authorization, and profile data.
 *
 * Dependencies: none
 * Used by: IdentityService, SessionManager, repository implementations
 */
// declare abstract type for this file
public abstract class User {

    /**
     * Primary key for the user record.
     */
    // field declaration for id
    private Long id;

    /**
     * Unique username used for authentication.
     */
    // field declaration for username
    private String username;

    /**
     * BCrypt hashed password string.
     */
    // field declaration for passwordHash
    private String passwordHash;

    /**
     * Roles assigned to the user, e.g. ADMIN, CASHIER.
     */
    // create or update a collection or object
    private List<String> roles = new ArrayList<>();

    /**
     * Fine-grained permission strings for authorization checks.
     */
    // create or update a collection or object
    private List<String> permissions = new ArrayList<>();

    // method declaration for User
    public User() {
        // Default constructor required by frameworks and serialization.
    }

    // method declaration for User
    public User(Long id, String username, String passwordHash, List<String> roles, List<String> permissions) {
        // assign value to object field
        this.id = id;
        // assign value to object field
        this.username = username;
        // assign value to object field
        this.passwordHash = passwordHash;
        // assign value to object field
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
        // assign value to object field
        this.permissions = permissions == null ? new ArrayList<>() : new ArrayList<>(permissions);
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

    // method declaration for getUsername
    public String getUsername() {
        // return statement from method
        return username;
    }

    // method declaration for setUsername
    public void setUsername(String username) {
        // assign value to object field
        this.username = username;
    }

    // method declaration for getPasswordHash
    public String getPasswordHash() {
        // return statement from method
        return passwordHash;
    }

    // method declaration for setPasswordHash
    public void setPasswordHash(String passwordHash) {
        // assign value to object field
        this.passwordHash = passwordHash;
    }

    // method declaration for getRoles
    public List<String> getRoles() {
        // return statement from method
        return new ArrayList<>(roles);
    }

    // method declaration for setRoles
    public void setRoles(List<String> roles) {
        // assign value to object field
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
    }

    // method declaration for getPermissions
    public List<String> getPermissions() {
        // return statement from method
        return new ArrayList<>(permissions);
    }

    // method declaration for setPermissions
    public void setPermissions(List<String> permissions) {
        // assign value to object field
        this.permissions = permissions == null ? new ArrayList<>() : new ArrayList<>(permissions);
    }

    public abstract String getType();

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof User)) return false;
        User user = (User) o;
        // return statement from method
        return Objects.equals(id, user.id);
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
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", roles=" + roles +
                '}';
    }
}
