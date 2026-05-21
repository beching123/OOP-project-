// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import java.util.Map;

// imported type required by this class
import com.company.ecommerce.model.Order;
// imported type required by this class
import com.company.ecommerce.model.PaymentException;
// imported type required by this class
import com.company.ecommerce.model.PaymentResult;

/**
 * PaymentGateway — abstraction for external payment providers.
 *
 * <p>Implementations translate internal order data into provider-specific requests and
 * normalize the response into a {@link PaymentResult}.
 */
public interface PaymentGateway {

    /**
     * Charge the specified order using provider parameters.
     *
     * @throws PaymentException for provider-side failures or client errors.
     */
    PaymentResult charge(Order order, Map<String, String> params) throws PaymentException;
}
