package com.company.ecommerce.rest.controller;

import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.repository.ReviewRepoImpl;
import com.company.ecommerce.rest.repository.UserRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepoImpl reviewRepo;
    private final UserRepoImpl userRepo;
    private final JwtUtil jwtUtil;

    public ReviewController(ReviewRepoImpl reviewRepo, UserRepoImpl userRepo, JwtUtil jwtUtil) {
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        List<Map<String, Object>> reviews = reviewRepo.findByProductId(productId);
        Map<String, Object> stats = reviewRepo.getStats(productId);
        return ResponseEntity.ok(Map.of("reviews", reviews, "stats", stats));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<?> addReview(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long productId,
                                        @RequestBody Map<String, Object> body) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        String userName = "Anonymous";
        var userOpt = userRepo.findById(userId);
        if (userOpt.isPresent()) {
            var user = userOpt.get();
            userName = (user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "");
            userName = userName.trim().isEmpty() ? user.getUsername() : userName;
        }

        int rating = body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : 5;
        String title = body.get("title") != null ? body.get("title").toString() : "";
        String message = body.get("message") != null ? body.get("message").toString() : "";

        Map<String, Object> result = reviewRepo.save(userId, productId, userName, rating, title, message);
        return ResponseEntity.status(201).body(result);
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
