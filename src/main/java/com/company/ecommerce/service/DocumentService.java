// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import com.company.ecommerce.model.Order;

/**
 * DocumentService — generates printable representations of orders (HTML/PDF).
 */
public interface DocumentService {

    /**
     * Render receipt HTML for the given order.
     */
    String getReceiptHtml(Order order);

    /**
     * Render receipt as PDF bytes for printing or download.
     */
    byte[] getReceiptPdf(Order order);
}
