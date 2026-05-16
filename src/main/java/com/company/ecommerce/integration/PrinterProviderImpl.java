package com.company.ecommerce.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.company.ecommerce.model.Order;

@Component
public class PrinterProviderImpl implements PrinterProvider {

    private static final Logger logger = LoggerFactory.getLogger(PrinterProviderImpl.class);

    @Override
    public void printReceipt(Order order) {
        logger.info("Printing receipt for order id {}", order.getId());
    }
}
