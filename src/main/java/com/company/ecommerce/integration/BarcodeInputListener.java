package com.company.ecommerce.integration;

import org.springframework.stereotype.Component;

import com.company.ecommerce.model.Product;
import com.company.ecommerce.service.CatalogService;

@Component
public class BarcodeInputListener {

    private final CatalogService catalogService;

    public BarcodeInputListener(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    public Product lookupByBarcode(String barcode) {
        return catalogService.lookupByBarcode(barcode);
    }
}
