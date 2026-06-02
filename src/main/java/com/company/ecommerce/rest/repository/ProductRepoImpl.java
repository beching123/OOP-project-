package com.company.ecommerce.rest.repository;

import com.company.ecommerce.app.DbConnection;
import com.company.ecommerce.model.Product;
import com.company.ecommerce.persistence.ProductRepo;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepoImpl implements ProductRepo {

    @Override
    public Optional<Product> findById(Long id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding product by id", e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Product> findByBarcode(String barcode) {
        String sql = "SELECT * FROM products WHERE barcode = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, barcode);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding product by barcode", e);
        }
        return Optional.empty();
    }

    @Override
    public List<Product> findAll() {
        String sql = "SELECT * FROM products ORDER BY id";
        List<Product> products = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                products.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all products", e);
        }
        return products;
    }

    public List<Product> findByCategory(String category) {
        String sql = "SELECT * FROM products WHERE category = ? ORDER BY id";
        List<Product> products = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding products by category", e);
        }
        return products;
    }

    public List<Product> search(String query) {
        String sql = "SELECT * FROM products WHERE name ILIKE ? OR barcode ILIKE ? ORDER BY id";
        List<Product> products = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            String pattern = "%" + query + "%";
            ps.setString(1, pattern);
            ps.setString(2, pattern);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error searching products", e);
        }
        return products;
    }

    public List<Product> findFeatured(int limit) {
        String sql = "SELECT * FROM products WHERE is_featured = true LIMIT ?";
        List<Product> products = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding featured products", e);
        }
        return products;
    }

    @Override
    public void decrementStock(Long productId, int quantity) {
        String sql = "UPDATE products SET stock = stock - ?, version = version + 1 WHERE id = ? AND stock >= ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setLong(2, productId);
            ps.setInt(3, quantity);
            int updated = ps.executeUpdate();
            if (updated == 0) {
                throw new RuntimeException("Insufficient stock or product not found");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error decrementing stock", e);
        }
    }

    @Override
    public void incrementStock(Long productId, int quantity) {
        String sql = "UPDATE products SET stock = stock + ?, version = version + 1 WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setLong(2, productId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error incrementing stock", e);
        }
    }

    @Override
    public void updatePrice(Long productId, BigDecimal newPrice) {
        String sql = "UPDATE products SET price = ?, version = version + 1 WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBigDecimal(1, newPrice);
            ps.setLong(2, productId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating price", e);
        }
    }

    public Product save(Product product) {
        if (product.getId() == null) {
            return insert(product);
        } else {
            return updateProduct(product);
        }
    }

    public void delete(Long id) {
        String sql = "DELETE FROM products WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting product", e);
        }
    }

    private Product insert(Product product) {
        String sql = "INSERT INTO products (barcode, name, description, price, sale_price, stock, category, category_id, images, image_url, sku, rating, reviews, is_featured, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, product.getBarcode());
            ps.setString(2, product.getName());
            ps.setString(3, product.getDescription());
            ps.setBigDecimal(4, product.getPrice());
            ps.setBigDecimal(5, product.getSalePrice());
            ps.setInt(6, product.getStock());
            ps.setString(7, product.getCategory());
            ps.setObject(8, product.getCategoryId());
            ps.setString(9, product.getImages());
            ps.setString(10, product.getImageUrl());
            ps.setString(11, product.getSku());
            ps.setDouble(12, product.getRating());
            ps.setInt(13, product.getReviews());
            ps.setBoolean(14, product.isFeatured());
            ps.setBoolean(15, product.isBestSeller());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                product.setId(keys.getLong(1));
            }
            return product;
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting product", e);
        }
    }

    private Product updateProduct(Product product) {
        String sql = "UPDATE products SET barcode = ?, name = ?, description = ?, price = ?, sale_price = ?, stock = ?, category = ?, category_id = ?, images = ?, image_url = ?, sku = ?, rating = ?, reviews = ?, is_featured = ?, is_best_seller = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, product.getBarcode());
            ps.setString(2, product.getName());
            ps.setString(3, product.getDescription());
            ps.setBigDecimal(4, product.getPrice());
            ps.setBigDecimal(5, product.getSalePrice());
            ps.setInt(6, product.getStock());
            ps.setString(7, product.getCategory());
            ps.setObject(8, product.getCategoryId());
            ps.setString(9, product.getImages());
            ps.setString(10, product.getImageUrl());
            ps.setString(11, product.getSku());
            ps.setDouble(12, product.getRating());
            ps.setInt(13, product.getReviews());
            ps.setBoolean(14, product.isFeatured());
            ps.setBoolean(15, product.isBestSeller());
            ps.setLong(16, product.getId());
            ps.executeUpdate();
            return product;
        } catch (SQLException e) {
            throw new RuntimeException("Error updating product", e);
        }
    }

    private Product mapRow(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setBarcode(rs.getString("barcode"));
        p.setName(rs.getString("name"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setSalePrice(rs.getBigDecimal("sale_price"));
        p.setStock(rs.getInt("stock"));
        p.setCategory(rs.getString("category"));
        p.setCategoryId(rs.getObject("category_id") != null ? rs.getLong("category_id") : null);
        p.setImages(rs.getString("images"));
        p.setImageUrl(rs.getString("image_url"));
        p.setSku(rs.getString("sku"));
        p.setRating(rs.getDouble("rating"));
        p.setReviews(rs.getInt("reviews"));
        p.setFeatured(rs.getBoolean("is_featured"));
        p.setBestSeller(rs.getBoolean("is_best_seller"));
        p.setVersion(rs.getInt("version"));
        return p;
    }
}
