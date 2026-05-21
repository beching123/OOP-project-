// package declaration for this source file
package com.company.ecommerce.persistence;

// imported type required by this class
import java.time.LocalDateTime;
// imported type required by this class
import java.util.List;

// imported type required by this class
import com.company.ecommerce.model.AuditRecord;

/**
 * AuditRepo — persistence interface for append-only audit trail records.
 *
 * <p>Audit data is used by administrators to inspect system activity and verify order flows.
 */
public interface AuditRepo {

    /**
     * Store a new audit record.
     */
    void save(AuditRecord audit);

    /**
     * Return the most recent audit records up to the given limit.
     */
    List<AuditRecord> findRecent(int limit);

    /**
     * Search audit records by date range, user, and action.
     */
    List<AuditRecord> findByFilter(LocalDateTime from, LocalDateTime to, Long userId, String action);
}
