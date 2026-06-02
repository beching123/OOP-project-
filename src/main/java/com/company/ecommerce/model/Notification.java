package com.company.ecommerce.model;

import java.time.LocalDateTime;
import java.util.Objects;

public final class Notification {
    private final Long id;
    private final Long userId;
    private final String title;
    private final String message;
    private final String type;
    private final Long referenceId;
    private final boolean read;
    private final LocalDateTime createdAt;

    public Notification(Long id, Long userId, String title, String message, String type, Long referenceId, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public Long getReferenceId() { return referenceId; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notification)) return false;
        Notification that = (Notification) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
