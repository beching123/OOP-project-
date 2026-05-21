// package declaration for this source file
package com.company.ecommerce.model;

/**
 * OrangeMoneyPayment — concrete Orange Mobile Money payment method.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class represents the Orange Money payment option for checkout.
 *
 * Dependencies: MobileMoneyPayment
 * Used by: CheckoutView, TradeService
 */
// declare class type for this file
public class OrangeMoneyPayment extends MobileMoneyPayment {

    // method declaration for OrangeMoneyPayment
    public OrangeMoneyPayment() {
        super();
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getCode
    public String getCode() {
        // return statement from method
        return "ORANGE";
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getProvider
    public String getProvider() {
        // return statement from method
        return "ORANGE";
    }
}
