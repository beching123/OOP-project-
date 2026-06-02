// package declaration for this source file
package com.company.ecommerce.model;

// imported type required by this class
import java.math.BigDecimal;
// imported type required by this class
import java.util.Objects;

// declare class type for this file
/**
 * Product — domain model representing a catalog item in the store.
 *
 * Fields:
 * - `id`: database primary key.
 * - `barcode`: retail barcode used by POS scanning.
 * - `name`: human-readable product name.
 * - `price`: product price as {@link java.math.BigDecimal} (money values must use BigDecimal).
 * - `stock`: current inventory count.
 * - `version`: optimistic-locking version used to detect concurrent updates.
 *
 * Usage:
 * - Lookups should use `barcode` for POS workflows.
 * - Updates to `stock` and `price` must be done through repository methods that honor the
 *   `version` field to prevent lost updates.
 */
public class Product {
    // field declaration for id
    private Long id;
    // field declaration for barcode
    private String barcode;
    // field declaration for name
    private String name;
    private String description;
    // field declaration for price
    private BigDecimal price;
    private BigDecimal salePrice;
    // field declaration for stock
    private int stock;
    private String category;
    private Long categoryId;
    private String images;
    private String imageUrl;
    private String sku;
    private double rating;
    private int reviews;
    private boolean featured;
    private boolean bestSeller;
    // field declaration for version
    private int version;

    // method declaration for Product
    public Product() {
        // Default constructor for frameworks.
    }

    // method declaration for Product
    public Product(Long id, String barcode, String name, BigDecimal price, int stock, int version) {
        // assign value to object field
        this.id = id;
        // assign value to object field
        this.barcode = barcode;
        // assign value to object field
        this.name = name;
        // assign value to object field
        this.price = price;
        // assign value to object field
        this.stock = stock;
        // assign value to object field
        this.version = version;
    }

    // method declaration for getId
    public Long getId() {
        // return statement from method
        return id;
    }

    // method declaration for setId
    public void setId(Long id) {
        // assign value to object field
        this.id = id;
    }

    // method declaration for getBarcode
    public String getBarcode() {
        // return statement from method
        return barcode;
    }

    // method declaration for setBarcode
    public void setBarcode(String barcode) {
        // assign value to object field
        this.barcode = barcode;
    }

    // method declaration for getName
    public String getName() {
        // return statement from method
        return name;
    }

    // method declaration for setName
    public void setName(String name) {
        // assign value to object field
        this.name = name;
    }

    // method declaration for getPrice
    public BigDecimal getPrice() {
        // return statement from method
        return price;
    }

    // method declaration for setPrice
    public void setPrice(BigDecimal price) {
        // assign value to object field
        this.price = price;
    }

    // method declaration for getStock
    public int getStock() {
        // return statement from method
        return stock;
    }

    // method declaration for setStock
    public void setStock(int stock) {
        // assign value to object field
        this.stock = stock;
    }

    // method declaration for getVersion
    public int getVersion() {
        // return statement from method
        return version;
    }

    // method declaration for setVersion
    public void setVersion(int version) {
        // assign value to object field
        this.version = version;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviews() { return reviews; }
    public void setReviews(int reviews) { this.reviews = reviews; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isBestSeller() { return bestSeller; }
    public void setBestSeller(boolean bestSeller) { this.bestSeller = bestSeller; }

    // annotation applied to the following declaration
    @Override
    // method declaration for equals
    public boolean equals(Object o) {
        // conditional check
        if (this == o) return true;
        // conditional check
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        // return statement from method
        return Objects.equals(id, product.id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for hashCode
    public int hashCode() {
        // return statement from method
        return Objects.hash(id);
    }

    // annotation applied to the following declaration
    @Override
    // method declaration for toString
    public String toString() {
        // return statement from method
        return "Product{" +
                "id=" + id +
                ", barcode='" + barcode + '\'' +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", stock=" + stock +
                ", version=" + version +
                '}';
    }
}
