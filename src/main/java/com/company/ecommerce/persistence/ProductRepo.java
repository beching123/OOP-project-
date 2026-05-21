// package declaration for this source file
package com.company.ecommerce.persistence;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.util.List;
// imported type required by this class
import java.util.Optional;

// imported type required by this class
import com.company.ecommerce.model.Product;

/**
 * ProductRepo — persistence layer contract for product inventory and pricing.
 *
 * <p>The repository is responsible for stock level updates and retrieving catalog items.
 */
public interface ProductRepo {

    /**
     * Find a product by its primary key.
     */
    Optional<Product> findById(Long id);

    /**
     * Find a product by its barcode for point-of-sale workflows.
     */
    Optional<Product> findByBarcode(String barcode);

    /**
     * Return all catalog products.
     */
    List<Product> findAll();

    /**
     * Reduce the available stock by `quantity`; should validate non-negative resulting stock.
     */
    void decrementStock(Long productId, int quantity);

    /**
     * Increase the available stock for goods received.
     */
    void incrementStock(Long productId, int quantity);

    /**
     * Update the product price in storage.
     */
    void updatePrice(Long productId, BigDecimal newPrice);
}
