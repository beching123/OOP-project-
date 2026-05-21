// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import com.company.ecommerce.model.Order;

/**
 * PrinterProvider — abstraction for receipt printing hardware or services.
 */
public interface PrinterProvider {

    /**
     * Print a receipt for the specified order.
     */
    void printReceipt(Order order);
}
