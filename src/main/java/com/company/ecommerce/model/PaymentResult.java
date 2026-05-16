package com.company.ecommerce.model;

import java.util.Objects;

public class PaymentResult {
    private boolean success;
    private String transactionId;
    private String errorMessage;

    public PaymentResult() {
    }

    public PaymentResult(boolean success, String transactionId, String errorMessage) {
        this.success = success;
        this.transactionId = transactionId;
        this.errorMessage = errorMessage;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PaymentResult)) return false;
        PaymentResult that = (PaymentResult) o;
        return success == that.success && Objects.equals(transactionId, that.transactionId) && Objects.equals(errorMessage, that.errorMessage);
    }

    @Override
    public int hashCode() {
        return Objects.hash(success, transactionId, errorMessage);
    }

    @Override
    public String toString() {
        return "PaymentResult{" +
                "success=" + success +
                ", transactionId='" + transactionId + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                '}';
    }
}
