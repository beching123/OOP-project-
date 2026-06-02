package com.company.ecommerce.rest.controller;

import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.repository.AddressRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepoImpl addressRepo;
    private final JwtUtil jwtUtil;

    public AddressController(AddressRepoImpl addressRepo, JwtUtil jwtUtil) {
        this.addressRepo = addressRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAddresses(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        List<Map<String, Object>> addresses = addressRepo.findByUserId(userId);
        return ResponseEntity.ok(Map.of("addresses", addresses, "total", addresses.size()));
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody Map<String, String> body) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        Map<String, Object> result = addressRepo.save(userId, body);
        return ResponseEntity.status(201).body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@RequestHeader("Authorization") String authHeader,
                                            @PathVariable Long id) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        boolean deleted = addressRepo.delete(userId, id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Address deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Address not found"));
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
