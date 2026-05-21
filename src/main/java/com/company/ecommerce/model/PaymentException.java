// package declaration for this source file
package com.company.ecommerce.model;

/**
 * PaymentException — runtime exception representing an unrecoverable payment processing error.
 *
 * <p>Adapters and the checkout flow may throw this to indicate provider failures that
 * should abort the current payment attempt.
 */
// declare class type for this file
public class PaymentException extends RuntimeException {
    // method declaration for PaymentException
    public PaymentException() {
        super();
    }

    // method declaration for PaymentException
    public PaymentException(String message) {
        super(message);
    }

    // method declaration for PaymentException
    public PaymentException(String message, Throwable cause) {
        super(message, cause);
    }
}
