package com.company.ecommerce.service;

import com.company.ecommerce.model.Order;

public interface DocumentService {

    String getReceiptHtml(Order order);

    byte[] getReceiptPdf(Order order);
}
