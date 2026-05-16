package com.company.ecommerce.service;

import java.math.BigDecimal;

import com.company.ecommerce.model.PaymentException;
import com.company.ecommerce.model.User;

public interface TradeService {

    long checkout(long orderId, String paymentMethod, User cashier) throws PaymentException;

    void voidSale(long orderId, User admin);

    void receiveStock(long productId, int quantity, User receiver);

    BigDecimal getDailyRevenue();
}
