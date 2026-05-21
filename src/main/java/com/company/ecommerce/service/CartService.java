// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import com.company.ecommerce.model.Order;
// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * CartService — operations for cart lifecycle and draft orders.
 *
 * <p>CartService manipulates draft orders before checkout. Methods accept a `User` to
 * perform authorization checks at the service layer.
 */
public interface CartService {

    /**
     * Create a new draft order for the given customer and return its id.
     */
    long createDraftOrder(User customer);

    /**
     * Add an item to the draft order identified by `orderId`.
     */
    void addItemToCart(long orderId, long productId, int quantity, User user);

    /**
     * Update the quantity of an existing item in the draft order.
     */
    void updateItemQuantity(long orderId, long productId, int newQuantity, User user);

    /**
     * Remove an item from the draft order.
     */
    void removeItem(long orderId, long productId, User user);

    /**
     * Return the draft order by id; returns null if not found.
     */
    Order getDraftOrder(long orderId);

    /**
     * Delete the draft order and its temporary data.
     */
    void deleteDraft(long orderId);
}
