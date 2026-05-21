// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import java.math.BigDecimal;

// imported type required by this class
import com.company.ecommerce.model.PaymentException;
// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * TradeService — core transactional operations for checkout and inventory.
 *
 * <p>Implementations must be transactional and ensure consistency between stock
 * and sales; use the `TransactionManager` abstraction in the `integration` package
 * where necessary.
 */
public interface TradeService {

    /**
     * Complete the checkout for the draft order and return the created sale id.
     *
     * @throws PaymentException for unrecoverable payment failures
     */
    long checkout(long orderId, String paymentMethod, User cashier) throws PaymentException;

    /**
     * Void a previously completed sale. Requires an admin user.
     */
    void voidSale(long orderId, User admin);

    /**
     * Increase inventory for a product when goods are received.
     */
    void receiveStock(long productId, int quantity, User receiver);

    /**
     * Calculate today's revenue across successful sales.
     */
    BigDecimal getDailyRevenue();
}
