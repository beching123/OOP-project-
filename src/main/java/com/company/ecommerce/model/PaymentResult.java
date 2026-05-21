// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.util.Objects;

/**
 * PaymentResult — simple value object returned by payment adapters.
 *
 * <p>Fields:
 * - `success`: whether the payment succeeded.
 * - `transactionId`: provider-assigned id for successful payments.
 * - `errorMessage`: human-readable error when `success` is false.
 */
// declare class type for this file
public class PaymentResult {
    // field declaration for success
    private boolean success;
    // field declaration for transactionId
    private String transactionId;
    // field declaration for errorMessage
    private String errorMessage;

    // method declaration for PaymentResult
    public PaymentResult() {
    }

    // method declaration for PaymentResult
    public PaymentResult(boolean success, String transactionId, String errorMessage) {
        // assign value to object field
        this.success = success;
        // assign value to object field
        this.transactionId = transactionId;
        // assign value to object field
        this.errorMessage = errorMessage;
    }

    // method declaration for isSuccess
    public boolean isSuccess() {
        // return statement from method
        return success;
    }

    // method declaration for setSuccess
    public void setSuccess(boolean success) {
        // assign value to object field
        this.success = success;
    }

    // method declaration for getTransactionId
    public String getTransactionId() {
        // return statement from method
        return transactionId;
    }

    // method declaration for setTransactionId
    public void setTransactionId(String transactionId) {
        // assign value to object field
        this.transactionId = transactionId;
    }

    // method declaration for getErrorMessage
    public String getErrorMessage() {
        // return statement from method
        return errorMessage;
    }

    // method declaration for setErrorMessage
    public void setErrorMessage(String errorMessage) {
        // assign value to object field
        this.errorMessage = errorMessage;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof PaymentResult)) return false;
        PaymentResult that = (PaymentResult) o;
        // return statement from method
        return success == that.success && Objects.equals(transactionId, that.transactionId) && Objects.equals(errorMessage, that.errorMessage);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(success, transactionId, errorMessage);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return "PaymentResult{" +
                "success=" + success +
                ", transactionId='" + transactionId + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                '}';
    }
}
