// package declaration for this source file
package com.company.ecommerce.model;

/**
 * InsufficientStockException — thrown when an order requests more quantity than available.
 *
 * <p>Service layers should catch this and return a user-friendly error suggesting available
 * quantities or backorder options.
 */
// declare class type for this file
public class InsufficientStockException extends RuntimeException {
    // method declaration for InsufficientStockException
    public InsufficientStockException() {
        super();
    }

    // method declaration for InsufficientStockException
    public InsufficientStockException(String message) {
        super(message);
    }

    // method declaration for InsufficientStockException
    public InsufficientStockException(String message, Throwable cause) {
        super(message, cause);
    }
}
