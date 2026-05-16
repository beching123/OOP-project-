package com.company.ecommerce.service;

import com.company.ecommerce.model.Order;
import com.company.ecommerce.model.User;

public interface CartService {

    long createDraftOrder(User customer);

    void addItemToCart(long orderId, long productId, int quantity, User user);

    void updateItemQuantity(long orderId, long productId, int newQuantity, User user);

    void removeItem(long orderId, long productId, User user);

    Order getDraftOrder(long orderId);

    void deleteDraft(long orderId);
}
