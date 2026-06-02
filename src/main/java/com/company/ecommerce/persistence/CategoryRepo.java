package com.company.ecommerce.persistence;

import com.company.ecommerce.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepo {
    Optional<Category> findById(Long id);
    List<Category> findAll();
    Category save(Category category);
    void delete(Long id);
}
