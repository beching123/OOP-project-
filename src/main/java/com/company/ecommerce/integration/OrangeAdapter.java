// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import java.util.Map;

// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.Order;
// imported type required by this class
import com.company.ecommerce.model.PaymentException;
// imported type required by this class
import com.company.ecommerce.model.PaymentResult;

/**
 * OrangeAdapter — concrete payment adapter for Orange Money.
 *
 * <p>This adapter is a placeholder implementation for Orange payment flows.
 */
@Component
public class OrangeAdapter implements PaymentGateway {

    @Override
    public PaymentResult charge(Order order, Map<String, String> params) throws PaymentException {
        return new PaymentResult(true, "ORANGE-PLACEHOLDER", null);
    }
}
