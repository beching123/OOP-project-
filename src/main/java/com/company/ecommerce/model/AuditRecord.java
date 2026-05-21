// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.time.LocalDateTime;
// imported type required by this class
import java.util.Objects;

/**
 * AuditRecord — immutable record used for audit logging and forensic trails.
 *
 * <p>Audit records are append-only; do not modify or delete once created. Stores the actor,
 * action, timestamp and optional order correlation id to help trace system events.
 */
public final class AuditRecord {
    // field declaration for id
    private final Long id;
    // field declaration for timestamp
    private final LocalDateTime timestamp;
    // field declaration for userId
    private final Long userId;
    // field declaration for userUsername
    private final String userUsername;
    // field declaration for action
    private final String action;
    // field declaration for details
    private final String details;
    // field declaration for orderId
    private final Long orderId;

    // method declaration for AuditRecord
    public AuditRecord(Long id, LocalDateTime timestamp, Long userId, String userUsername, String action, String details, Long orderId) {
        // assign value to object field
        this.id = id;
        // assign value to object field
        this.timestamp = timestamp;
        // assign value to object field
        this.userId = userId;
        // assign value to object field
        this.userUsername = userUsername;
        // assign value to object field
        this.action = action;
        // assign value to object field
        this.details = details;
        // assign value to object field
        this.orderId = orderId;
    }

    // method declaration for getId
    public Long getId() {
        // return statement from method
        return id;
    }

    // method declaration for getTimestamp
    public LocalDateTime getTimestamp() {
        // return statement from method
        return timestamp;
    }

    // method declaration for getUserId
    public Long getUserId() {
        // return statement from method
        return userId;
    }

    // method declaration for getUserUsername
    public String getUserUsername() {
        // return statement from method
        return userUsername;
    }

    // method declaration for getAction
    public String getAction() {
        // return statement from method
        return action;
    }

    // method declaration for getDetails
    public String getDetails() {
        // return statement from method
        return details;
    }

    // method declaration for getOrderId
    public Long getOrderId() {
        // return statement from method
        return orderId;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof AuditRecord)) return false;
        AuditRecord that = (AuditRecord) o;
        // return statement from method
        return Objects.equals(id, that.id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return "AuditRecord{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", userId=" + userId +
                ", userUsername='" + userUsername + '\'' +
                ", action='" + action + '\'' +
                ", details='" + details + '\'' +
                ", orderId=" + orderId +
                '}';
    }
}
