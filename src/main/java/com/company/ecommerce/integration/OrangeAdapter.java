package com.company.ecommerce.integration;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.company.ecommerce.model.Order;
import com.company.ecommerce.model.PaymentException;
import com.company.ecommerce.model.PaymentResult;

@Component
public class OrangeAdapter implements PaymentGateway {

    @Override
    public PaymentResult charge(Order order, Map<String, String> params) throws PaymentException {
        return new PaymentResult(true, "ORANGE-PLACEHOLDER", null);
    }
}
