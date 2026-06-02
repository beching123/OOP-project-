package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.Category;
import com.company.ecommerce.rest.dto.CategoryResponse;
import com.company.ecommerce.rest.repository.CategoryRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepoImpl categoryRepo;

    public CategoryController(CategoryRepoImpl categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<Category> categories = categoryRepo.findAll();
        List<CategoryResponse> response = categories.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepo.findById(id);
        if (category.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Category not found"));
        }
        return ResponseEntity.ok(toResponse(category.get()));
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryResponse request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());
        category.setIcon(request.getIcon());

        Category saved = categoryRepo.save(category);
        return ResponseEntity.status(201).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryResponse request) {
        Optional<Category> existing = categoryRepo.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Category not found"));
        }

        Category category = existing.get();
        if (request.getName() != null) category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImage() != null) category.setImage(request.getImage());
        if (request.getIcon() != null) category.setIcon(request.getIcon());

        Category saved = categoryRepo.save(category);
        return ResponseEntity.ok(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Optional<Category> existing = categoryRepo.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Category not found"));
        }
        categoryRepo.delete(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setImage(category.getImage());
        response.setIcon(category.getIcon());
        return response;
    }
}
