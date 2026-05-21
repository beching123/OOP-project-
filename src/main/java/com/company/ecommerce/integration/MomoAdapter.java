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
 * MomoAdapter — concrete payment adapter for MTN Mobile Money.
 *
 * <p>This adapter is a placeholder; it returns a stubbed successful `PaymentResult` for
 * skeleton and integration testing.
 */
@Component
public class MomoAdapter implements PaymentGateway {

    @Override
    public PaymentResult charge(Order order, Map<String, String> params) throws PaymentException {
        return new PaymentResult(true, "MOMO-PLACEHOLDER", null);
    }
}
