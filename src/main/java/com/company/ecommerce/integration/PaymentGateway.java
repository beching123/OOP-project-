package com.company.ecommerce.integration;

import java.util.Map;

import com.company.ecommerce.model.Order;
import com.company.ecommerce.model.PaymentException;
import com.company.ecommerce.model.PaymentResult;

public interface PaymentGateway {

    PaymentResult charge(Order order, Map<String, String> params) throws PaymentException;
}
