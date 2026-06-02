package com.company.ecommerce.persistence;

import com.company.ecommerce.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface TransactionRepo {
    Optional<Transaction> findById(Long id);
    Optional<Transaction> findByPaymentReference(String paymentReference);
    List<Transaction> findByOrderId(Long orderId);
    Transaction save(Transaction transaction);
}
