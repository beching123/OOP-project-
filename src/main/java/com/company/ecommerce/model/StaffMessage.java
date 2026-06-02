package com.company.ecommerce.model;

import java.time.LocalDateTime;
import java.util.Objects;

public final class StaffMessage {
    private final Long id;
    private final Long senderId;
    private final String senderName;
    private final Long recipientId;
    private final String recipientName;
    private final String message;
    private final boolean read;
    private final LocalDateTime createdAt;

    public StaffMessage(Long id, Long senderId, String senderName, Long recipientId, String recipientName, String message, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getSenderId() { return senderId; }
    public String getSenderName() { return senderName; }
    public Long getRecipientId() { return recipientId; }
    public String getRecipientName() { return recipientName; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StaffMessage)) return false;
        StaffMessage that = (StaffMessage) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
