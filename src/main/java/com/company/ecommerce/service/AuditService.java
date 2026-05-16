package com.company.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;

import com.company.ecommerce.model.AuditRecord;
import com.company.ecommerce.model.User;

public interface AuditService {

    void record(String action, Long orderId, User user, String details);

    List<AuditRecord> getRecent(int limit);

    List<AuditRecord> search(LocalDateTime from, LocalDateTime to, Long userId, String action);
}
