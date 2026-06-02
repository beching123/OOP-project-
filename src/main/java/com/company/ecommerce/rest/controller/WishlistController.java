package com.company.ecommerce.rest.controller;

import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.repository.WishlistRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepoImpl wishlistRepo;
    private final JwtUtil jwtUtil;

    public WishlistController(WishlistRepoImpl wishlistRepo, JwtUtil jwtUtil) {
        this.wishlistRepo = wishlistRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getWishlist(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        List<Map<String, Object>> items = wishlistRepo.findByUserId(userId);
        return ResponseEntity.ok(Map.of("items", items, "total", items.size()));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkWishlist(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long productId) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        boolean isWishlisted = wishlistRepo.isWishlisted(userId, productId);
        return ResponseEntity.ok(Map.of("isWishlisted", isWishlisted));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long productId) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        Map<String, Object> result = wishlistRepo.add(userId, productId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable Long productId) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        boolean removed = wishlistRepo.remove(userId, productId);
        return ResponseEntity.ok(Map.of("removed", removed));
    }

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            return jwtUtil.extractUserId(token);
        }
        return null;
    }
}
