package com.company.ecommerce.model;

import java.time.LocalDateTime;
import java.util.Objects;

public final class AuditRecord {
    private final Long id;
    private final LocalDateTime timestamp;
    private final Long userId;
    private final String userUsername;
    private final String action;
    private final String details;
    private final Long orderId;

    public AuditRecord(Long id, LocalDateTime timestamp, Long userId, String userUsername, String action, String details, Long orderId) {
        this.id = id;
        this.timestamp = timestamp;
        this.userId = userId;
        this.userUsername = userUsername;
        this.action = action;
        this.details = details;
        this.orderId = orderId;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserUsername() {
        return userUsername;
    }

    public String getAction() {
        return action;
    }

    public String getDetails() {
        return details;
    }

    public Long getOrderId() {
        return orderId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AuditRecord)) return false;
        AuditRecord that = (AuditRecord) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
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
