package com.company.ecommerce.service;

import com.company.ecommerce.model.Order;

public interface NotificationService {

    void sendReceipt(Order order);
}
