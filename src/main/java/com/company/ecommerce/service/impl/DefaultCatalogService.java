package com.company.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.company.ecommerce.model.Product;
import com.company.ecommerce.model.User;
import com.company.ecommerce.service.CatalogService;

@Service
public class DefaultCatalogService implements CatalogService {

    @Override
    public Product lookupByBarcode(String barcode) {
        Product product = new Product();
        product.setBarcode(barcode);
        product.setName("Unknown product");
        product.setPrice(BigDecimal.ZERO);
        product.setStock(0);
        product.setVersion(0);
        return product;
    }

    @Override
    public List<Product> getAllProducts() {
        return new ArrayList<>();
    }

    @Override
    public void updatePrice(long productId, BigDecimal newPrice, User admin) {
        // stub implementation for skeleton
    }
}
