package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.User;
import com.company.ecommerce.persistence.UserRepo;
import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepo userRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepo.findByUsername(request.getEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByEmail(request.getEmail());
        }
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String role = user.getRoles().isEmpty() ? "CUSTOMER" : user.getRoles().get(0);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), role);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(user.getFirstName() != null ? user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "") : user.getUsername());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail() != null ? user.getEmail() : user.getUsername());
        userResponse.setPhone(user.getPhone());
        userResponse.setLocation(user.getLocation());
        userResponse.setAvatar(user.getAvatar());
        userResponse.setRole("ROLE_" + role);

        return ResponseEntity.ok(new AuthResponse(userResponse, token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        Optional<User> existing = userRepo.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Email already exists"));
        }

        User user = new com.company.ecommerce.model.Customer();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of("CUSTOMER"));
        user.setPermissions(new ArrayList<>());
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), "CUSTOMER");

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(request.getFirstName() + " " + request.getLastName());
        userResponse.setFirstName(request.getFirstName());
        userResponse.setLastName(request.getLastName());
        userResponse.setEmail(request.getEmail());
        userResponse.setRole("ROLE_CUSTOMER");

        return ResponseEntity.status(201).body(new AuthResponse(userResponse, token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getFirstName() != null ? user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "") : user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail() != null ? user.getEmail() : user.getUsername());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setAvatar(user.getAvatar());
        String role = user.getRoles().isEmpty() ? "CUSTOMER" : user.getRoles().get(0);
        response.setRole("ROLE_" + role);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody ProfileUpdateRequest request) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (request.getName() != null) {
            user.setUsername(request.getName());
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        userRepo.save(user);

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getFirstName() != null ? user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "") : user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail() != null ? user.getEmail() : user.getUsername());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setAvatar(user.getAvatar());
        String role = user.getRoles().isEmpty() ? "CUSTOMER" : user.getRoles().get(0);
        response.setRole("ROLE_" + role);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody PasswordChangeRequest request) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(400).body(Map.of("error", "Current password is incorrect"));
        }

        userRepo.updatePassword(userId, passwordEncoder.encode(request.getNewPassword()));
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            return jwtUtil.extractUserId(token);
        }
        return null;
    }
}
