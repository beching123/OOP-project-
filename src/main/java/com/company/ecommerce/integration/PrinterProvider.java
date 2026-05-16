package com.company.ecommerce.integration;

import com.company.ecommerce.model.Order;

public interface PrinterProvider {

    void printReceipt(Order order);
}
