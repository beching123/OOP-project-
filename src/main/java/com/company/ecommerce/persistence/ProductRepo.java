package com.company.ecommerce.persistence;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.company.ecommerce.model.Product;

public interface ProductRepo {

    Optional<Product> findById(Long id);

    Optional<Product> findByBarcode(String barcode);

    List<Product> findAll();

    void decrementStock(Long productId, int quantity);

    void incrementStock(Long productId, int quantity);

    void updatePrice(Long productId, BigDecimal newPrice);
}
