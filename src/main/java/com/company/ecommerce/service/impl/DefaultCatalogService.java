// package declaration for this source file
package com.company.ecommerce.service.impl;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.util.ArrayList;
// imported type required by this class
import java.util.List;

// imported type required by this class
import org.springframework.stereotype.Service;

// imported type required by this class
import com.company.ecommerce.model.Product;
// imported type required by this class
import com.company.ecommerce.model.User;
// imported type required by this class
import com.company.ecommerce.service.CatalogService;

/**
 * DefaultCatalogService — simple catalog service implementation used by the skeleton.
 *
 * <p>It provides product lookup and pricing update hooks without real persistence.
 */
@Service
public class DefaultCatalogService implements CatalogService {

    // annotation applied to the following declaration
    @Override
    // method declaration for lookupByBarcode
    public Product lookupByBarcode(String barcode) {
        // create or update a collection or object
        Product product = new Product();
        product.setBarcode(barcode);
        product.setName("Unknown product");
        product.setPrice(BigDecimal.ZERO);
        product.setStock(0);
        product.setVersion(0);
        // return statement from method
        return product;
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for getAllProducts
    public List<Product> getAllProducts() {
        // return statement from method
        return new ArrayList<>();
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for updatePrice
    public void updatePrice(long productId, BigDecimal newPrice, User admin) {
        // stub implementation for skeleton
    }
}
