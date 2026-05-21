// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.util.List;

// imported type required by this class
import com.company.ecommerce.model.Product;
// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * CatalogService — read/update operations for product catalog and pricing.
 *
 * <p>Implementations must handle concurrency and validation. Price updates should only be
 * allowed for users with appropriate privileges (see `IdentityService`).
 */
public interface CatalogService {

    /**
     * Lookup a product by its retail `barcode`.
     */
    Product lookupByBarcode(String barcode);

    /**
     * Return all products in the catalog.
     */
    List<Product> getAllProducts();

    /**
     * Update the product price. Implementations should verify `admin` permissions.
     */
    void updatePrice(long productId, BigDecimal newPrice, User admin);
}
