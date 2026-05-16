package com.company.ecommerce.persistence;

import java.time.LocalDateTime;
import java.util.List;

import com.company.ecommerce.model.AuditRecord;

public interface AuditRepo {

    void save(AuditRecord audit);

    List<AuditRecord> findRecent(int limit);

    List<AuditRecord> findByFilter(LocalDateTime from, LocalDateTime to, Long userId, String action);
}
