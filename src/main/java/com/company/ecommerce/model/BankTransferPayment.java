// package declaration for this source file
package com.company.ecommerce.model;

/**
 * BankTransferPayment — concrete payment method for bank transfers.
 * Package: com.company.ecommerce.model
 * Layer: model
 *
 * This class represents bank transfer payments.
 *
 * Dependencies: PaymentMethod
 * Used by: CheckoutView, TradeService
 */
// declare class type for this file
public class BankTransferPayment extends PaymentMethod {

    // method declaration for BankTransferPayment
    public BankTransferPayment() {
        super();
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getCode
    public String getCode() {
        // return statement from method
        return "BANK_TRANSFER";
    }
}
