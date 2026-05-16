package com.company.ecommerce.model;

import java.math.BigDecimal;
import java.util.Objects;

public class Product {
    private Long id;
    private String barcode;
    private String name;
    private BigDecimal price;
    private int stock;
    private int version;

    public Product() {
    }

    public Product(Long id, String barcode, String name, BigDecimal price, int stock, int version) {
        this.id = id;
        this.barcode = barcode;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.version = version;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", barcode='" + barcode + '\'' +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", stock=" + stock +
                ', version=" + version +
                '}';
    }
}
