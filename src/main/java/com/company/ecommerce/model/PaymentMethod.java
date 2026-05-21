// package declaration for this source file
package com.company.ecommerce.model;

/**
 * PaymentMethod — abstract base for all payment method types.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class defines the payment instrument contract for checkout.
 *
 * Dependencies: none
 * Used by: TradeService, CheckoutView, integration adapters
 */
// declare abstract type for this file
public abstract class PaymentMethod {

    /**
     * Gets the payment method code used by the checkout workflow.
     */
    public abstract String getCode();

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return getCode();
    }
}
