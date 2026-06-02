package com.company.ecommerce.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SupportTicket {
    public static final String STATUS_OPEN = "open";
    public static final String STATUS_IN_PROGRESS = "in_progress";
    public static final String STATUS_ESCALATED = "escalated";
    public static final String STATUS_RESOLVED = "resolved";
    public static final String STATUS_CLOSED = "closed";

    public static final String PRIORITY_LOW = "low";
    public static final String PRIORITY_MEDIUM = "medium";
    public static final String PRIORITY_HIGH = "high";
    public static final String PRIORITY_URGENT = "urgent";

    private Long id;
    private String subject;
    private String message;
    private String status;
    private String priority;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long staffId;
    private String staffName;
    private String orderNumber;
    private String category;
    private List<Reply> replies = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SupportTicket() {}

    public static class Reply {
        private Long id;
        private String message;
        private String author;
        private String authorRole;
        private LocalDateTime createdAt;

        public Reply() {}

        public Reply(Long id, String message, String author, String authorRole, LocalDateTime createdAt) {
            this.id = id;
            this.message = message;
            this.author = author;
            this.authorRole = authorRole;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }
        public String getAuthorRole() { return authorRole; }
        public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<Reply> getReplies() { return new ArrayList<>(replies); }
    public void setReplies(List<Reply> replies) { this.replies = replies == null ? new ArrayList<>() : new ArrayList<>(replies); }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SupportTicket)) return false;
        SupportTicket that = (SupportTicket) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
