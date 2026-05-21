// package declaration for this source file
package com.company.ecommerce.model;

/**
 * MobileMoneyPayment — abstract base for mobile money payments.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class groups mobile money payment types.
 *
 * Dependencies: PaymentMethod
 * Used by: CheckoutView, TradeService
 */
// declare abstract type for this file
public abstract class MobileMoneyPayment extends PaymentMethod {

    // method declaration for MobileMoneyPayment
    public MobileMoneyPayment() {
        super();
    }

    public abstract String getProvider();
}
