// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import java.time.LocalDateTime;
// imported type required by this class
import java.util.List;

// imported type required by this class
import com.company.ecommerce.model.AuditRecord;
// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * AuditService — append-only audit logging interface.
 *
 * <p>Implementations must ensure records are durable and tamper-evident where required.
 */
public interface AuditService {

    /**
     * Record an audit event with optional `orderId` correlation.
     */
    void record(String action, Long orderId, User user, String details);

    /**
     * Return the most recent audit records up to `limit`.
     */
    List<AuditRecord> getRecent(int limit);

    /**
     * Search audit records by time window, user, and action.
     */
    List<AuditRecord> search(LocalDateTime from, LocalDateTime to, Long userId, String action);
}
