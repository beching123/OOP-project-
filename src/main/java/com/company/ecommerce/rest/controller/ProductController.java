package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.Product;
import com.company.ecommerce.rest.dto.PaginatedResponse;
import com.company.ecommerce.rest.dto.ProductResponse;
import com.company.ecommerce.rest.repository.ProductRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepoImpl productRepo;

    public ProductController(ProductRepoImpl productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "12") int limit,
            @RequestParam(required = false) String sort) {

        List<Product> products;

        if (featured != null && featured) {
            products = productRepo.findFeatured(limit);
        } else if (search != null && !search.isEmpty()) {
            products = productRepo.search(search);
        } else if (category != null && !category.isEmpty()) {
            products = productRepo.findByCategory(category);
        } else {
            products = productRepo.findAll();
        }

        if (sort != null) {
            switch (sort) {
                case "price-low" -> products.sort((a, b) -> a.getPrice().compareTo(b.getPrice()));
                case "price-high" -> products.sort((a, b) -> b.getPrice().compareTo(a.getPrice()));
                case "newest" -> products.sort((a, b) -> Long.compare(b.getId(), a.getId()));
            }
        }

        int total = products.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<Product> paged = start < total ? products.subList(start, end) : new ArrayList<>();

        List<ProductResponse> response = paged.stream().map(this::toResponse).toList();

        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Optional<Product> product = productRepo.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
        }
        return ResponseEntity.ok(toResponse(product.get()));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductResponse request) {
        Product product = new Product();
        product.setBarcode(request.getSku() != null ? request.getSku() : "SKU-" + System.currentTimeMillis());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setCategory(request.getCategory());
        product.setCategoryId(request.getCategoryId());
        product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.setImages(String.join(",", request.getImages()));
        }
        product.setFeatured(Boolean.TRUE.equals(request.getIsFeatured()));
        product.setBestSeller(Boolean.TRUE.equals(request.getIsBestSeller()));

        Product saved = productRepo.save(product);
        return ResponseEntity.status(201).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductResponse request) {
        Optional<Product> existing = productRepo.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
        }

        Product product = existing.get();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock() != null ? request.getStock() : product.getStock());
        product.setCategory(request.getCategory());
        product.setCategoryId(request.getCategoryId());
        product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.setImages(String.join(",", request.getImages()));
        }
        if (request.getIsFeatured() != null) product.setFeatured(request.getIsFeatured());
        if (request.getIsBestSeller() != null) product.setBestSeller(request.getIsBestSeller());

        Product saved = productRepo.save(product);
        return ResponseEntity.ok(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> existing = productRepo.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
        }
        productRepo.delete(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setSku(product.getSku() != null ? product.getSku() : product.getBarcode());
        response.setDescription(product.getDescription() != null ? product.getDescription() : "");
        response.setCategory(product.getCategory() != null ? product.getCategory() : "general");
        response.setCategoryId(product.getCategoryId());
        response.setImageUrl(product.getImageUrl());
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImages(List.of(product.getImages().split(",")));
        } else if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            response.setImages(List.of(product.getImageUrl()));
        } else {
            response.setImages(List.of());
        }
        response.setRating(product.getRating() > 0 ? product.getRating() : 0.0);
        response.setReviews(product.getReviews());
        response.setIsFeatured(product.isFeatured());
        response.setIsBestSeller(product.isBestSeller());
        return response;
    }
}
