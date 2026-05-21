// package declaration for this source file
package com.company.ecommerce.persistence;

// imported type required by this class
import java.util.List;
// imported type required by this class
import java.util.Optional;

// imported type required by this class
import com.company.ecommerce.model.Order;

/**
 * OrderRepo — order persistence operations, including draft and finalized orders.
 *
 * <p>The interface supports optimistic lock-aware status updates to prevent race conditions.
 */
public interface OrderRepo {

    /**
     * Save a new order or persist a completed order.
     */
    Order save(Order order);

    /**
     * Persist changes to a draft order before checkout.
     */
    void updateDraft(Order order);

    /**
     * Lookup an order by its primary key.
     */
    Optional<Order> findById(Long id);

    /**
     * Update the order status using optimistic locking on `expectedVersion`.
     */
    void updateStatus(Long orderId, String newStatus, int expectedVersion);

    /**
     * Return orders filtered by status.
     */
    List<Order> findByStatus(String status);
}
