// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.Product;
// imported type required by this class
import com.company.ecommerce.service.CatalogService;

/**
 * BarcodeInputListener — integration point for barcode scanner input.
 *
 * <p>This component translates scanned barcodes into product lookups via the catalog service.
 */
@Component
public class BarcodeInputListener {

    private final CatalogService catalogService;

    // method declaration for BarcodeInputListener
    public BarcodeInputListener(CatalogService catalogService) {
        // assign value to object field
        this.catalogService = catalogService;
    }

    // method declaration for lookupByBarcode
    public Product lookupByBarcode(String barcode) {
        // return statement from method
        return catalogService.lookupByBarcode(barcode);
    }
}
