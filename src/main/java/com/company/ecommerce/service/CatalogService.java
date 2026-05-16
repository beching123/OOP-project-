package com.company.ecommerce.service;

import java.math.BigDecimal;
import java.util.List;

import com.company.ecommerce.model.Product;
import com.company.ecommerce.model.User;

public interface CatalogService {

    Product lookupByBarcode(String barcode);

    List<Product> getAllProducts();

    void updatePrice(long productId, BigDecimal newPrice, User admin);
}
