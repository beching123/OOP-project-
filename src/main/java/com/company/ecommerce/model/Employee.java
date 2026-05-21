// package declaration for this source file
package com.company.ecommerce.model;

/**
 * Employee — abstract user subclass for system employees.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This abstract class represents a user account that is an employee of the shop.
 * It extends the shared user identity with employee-specific metadata.
 *
 * Dependencies: User
 * Used by: Admin, Cashier, IdentityService
 */
// declare abstract type for this file
public abstract class Employee extends User {

    /**
     * Employee badge number or internal staff identifier.
     */
    // field declaration for employeeNumber
    private String employeeNumber;

    // method declaration for Employee
    public Employee() {
        super();
    }

    // method declaration for Employee
    public Employee(Long id, String username, String passwordHash, java.util.List<String> roles, java.util.List<String> permissions, String employeeNumber) {
        super(id, username, passwordHash, roles, permissions);
        // assign value to object field
        this.employeeNumber = employeeNumber;
    }

    // method declaration for getEmployeeNumber
    public String getEmployeeNumber() {
        // return statement from method
        return employeeNumber;
    }

    // method declaration for setEmployeeNumber
    public void setEmployeeNumber(String employeeNumber) {
        // assign value to object field
        this.employeeNumber = employeeNumber;
    }

    public abstract String getEmployeeRole();

    // annotation applied to the following declaration
    @Override
    // method declaration for getType
    public String getType() {
        // return statement from method
        return "EMPLOYEE";
    }
}
