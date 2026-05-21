// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import org.slf4j.Logger;
// imported type required by this class
import org.slf4j.LoggerFactory;
// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.Order;

/**
 * PrinterProviderImpl — stub implementation for receipt printing.
 *
 * <p>It logs the print request in the skeleton application rather than talking to real hardware.
 */
@Component
public class PrinterProviderImpl implements PrinterProvider {

    private static final Logger logger = LoggerFactory.getLogger(PrinterProviderImpl.class);

    // annotation applied to the following declaration
    @Override
    // method declaration for printReceipt
    public void printReceipt(Order order) {
        logger.info("Printing receipt for order id {}", order.getId());
    }
}
