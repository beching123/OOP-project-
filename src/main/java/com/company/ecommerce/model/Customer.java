// package declaration for this source file
package com.company.ecommerce.model;

/**
 * Customer — concrete user representing a shopper.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class represents a retail customer account in the system.
 * It inherits the shared identity fields from User.
 *
 * Dependencies: User
 * Used by: CartService, CheckoutView, IdentityService
 */
// declare class type for this file
public class Customer extends User {

    // method declaration for Customer
    public Customer() {
        super();
    }

    // method declaration for Customer
    public Customer(Long id, String username, String passwordHash, java.util.List<String> roles, java.util.List<String> permissions) {
        super(id, username, passwordHash, roles, permissions);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getType
    public String getType() {
        // return statement from method
        return "CUSTOMER";
    }
}
