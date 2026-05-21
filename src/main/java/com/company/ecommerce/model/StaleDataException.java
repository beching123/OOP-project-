// package declaration for this source file
package com.company.ecommerce.model;

/**
 * StaleDataException — thrown when an optimistic-lock version check fails.
 *
 * <p>Used by repository implementations to signal that the caller attempted to update
 * a record that has been changed by another transaction. Callers should surface a
 * user-friendly message and offer a retry path where appropriate.
 */
// declare class type for this file
public class StaleDataException extends RuntimeException {
    // method declaration for StaleDataException
    public StaleDataException() {
        super();
    }

    // method declaration for StaleDataException
    public StaleDataException(String message) {
        super(message);
    }

    // method declaration for StaleDataException
    public StaleDataException(String message, Throwable cause) {
        super(message, cause);
    }
}
