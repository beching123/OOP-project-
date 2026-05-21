// package declaration for this source file
package com.company.ecommerce.model;

/**
 * MomoPayment — concrete MTN Mobile Money payment method.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class represents the MoMo payment option for checkout.
 *
 * Dependencies: MobileMoneyPayment
 * Used by: CheckoutView, TradeService
 */
// declare class type for this file
public class MomoPayment extends MobileMoneyPayment {

    // method declaration for MomoPayment
    public MomoPayment() {
        super();
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getCode
    public String getCode() {
        // return statement from method
        return "MOMO";
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getProvider
    public String getProvider() {
        // return statement from method
        return "MTN";
    }
}
