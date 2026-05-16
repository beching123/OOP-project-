package com.company.ecommerce.persistence;

import java.util.List;
import java.util.Optional;

import com.company.ecommerce.model.Order;

public interface OrderRepo {

    Order save(Order order);

    void updateDraft(Order order);

    Optional<Order> findById(Long id);

    void updateStatus(Long orderId, String newStatus, int expectedVersion);

    List<Order> findByStatus(String status);
}
