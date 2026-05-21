// package declaration for this source file
package com.company.ecommerce.model;

/**
 * Cashier — concrete employee representing a cashier.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class specializes Employee for cashier-level system actors.
 *
 * Dependencies: Employee
 * Used by: IdentityService, service layer, UI views
 */
// declare class type for this file
public class Cashier extends Employee {

    // method declaration for Cashier
    public Cashier() {
        super();
    }

    // method declaration for Cashier
    public Cashier(Long id, String username, String passwordHash, java.util.List<String> roles, java.util.List<String> permissions, String employeeNumber) {
        super(id, username, passwordHash, roles, permissions, employeeNumber);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getEmployeeRole
    public String getEmployeeRole() {
        // return statement from method
        return "CASHIER";
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getType
    public String getType() {
        // return statement from method
        return "CASHIER";
    }
}
