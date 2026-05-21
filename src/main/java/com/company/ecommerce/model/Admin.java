// package declaration for this source file
package com.company.ecommerce.model;

/**
 * Admin — concrete employee representing an administrator.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class specializes Employee for admin-level system actors.
 *
 * Dependencies: Employee
 * Used by: IdentityService, security components, service layer
 */
// declare class type for this file
public class Admin extends Employee {

    // method declaration for Admin
    public Admin() {
        super();
    }

    // method declaration for Admin
    public Admin(Long id, String username, String passwordHash, java.util.List<String> roles, java.util.List<String> permissions, String employeeNumber) {
        super(id, username, passwordHash, roles, permissions, employeeNumber);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getEmployeeRole
    public String getEmployeeRole() {
        // return statement from method
        return "ADMIN";
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getType
    public String getType() {
        // return statement from method
        return "ADMIN";
    }
}
