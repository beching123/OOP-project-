// package declaration for this source file
package com.company.ecommerce.model;

/**
 * CashPayment — concrete payment method for cash transactions.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class is a placeholder for cash payment behavior.
 *
 * Dependencies: PaymentMethod
 * Used by: CheckoutView, TradeService
 */
// declare class type for this file
public class CashPayment extends PaymentMethod {

    // method declaration for CashPayment
    public CashPayment() {
        super();
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getCode
    public String getCode() {
        // return statement from method
        return "CASH";
    }
}
