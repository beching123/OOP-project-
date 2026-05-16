package com.company.ecommerce.model;

public class StaleDataException extends RuntimeException {
    public StaleDataException() {
        super();
    }

    public StaleDataException(String message) {
        super(message);
    }

    public StaleDataException(String message, Throwable cause) {
        super(message, cause);
    }
}
