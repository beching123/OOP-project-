package com.company.ecommerce.model;

public class Product {

    private String productID;
    private String productName;
    private double productCost;
    private int stock;
    private String postedDate;

    private Seller seller;
    private Category category;

    public Product() {
    }

    public Product(String productID, String productName,
                   double productCost, int stock, String postedDate) {
        this.productID = productID;
        this.productName = productName;
        this.productCost = productCost;
        this.stock = stock;
        this.postedDate = postedDate;
    }

    public void addToCart() {
        System.out.println("Product added to cart.");
    }

    public void sellProduct() {
        System.out.println("Product sold.");
    }

    public void getProductDetails() {
        System.out.println("Fetching product details.");
    }

    public void buyProduct() {
        System.out.println("Product purchased.");
    }

    // Getters and Setters

    public String getProductID() {
        return productID;
    }

    public void setProductID(String productID) {
        this.productID = productID;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getProductCost() {
        return productCost;
    }

    public void setProductCost(double productCost) {
        this.productCost = productCost;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(String postedDate) {
        this.postedDate = postedDate;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}