// package declaration for this source file
package com.company.ecommerce.model;

// declare class type for this file
public class AccessDeniedException extends RuntimeException {
    // method declaration for AccessDeniedException
    public AccessDeniedException() {
        super();
    }

    // method declaration for AccessDeniedException
    public AccessDeniedException(String message) {
        super(message);
    }

    // method declaration for AccessDeniedException
    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
