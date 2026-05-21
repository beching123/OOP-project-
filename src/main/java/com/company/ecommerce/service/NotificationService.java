// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import com.company.ecommerce.model.Order;

/**
 * NotificationService — handles asynchronous notifications (email/print/whatsapp).
 *
 * <p>Implementations should be side-effect free for the caller and enqueue work where
 * appropriate; failures should be retried by the delivery subsystem.
 */
public interface NotificationService {

    /**
     * Send a receipt using configured channels for the given order.
     */
    void sendReceipt(Order order);
}
