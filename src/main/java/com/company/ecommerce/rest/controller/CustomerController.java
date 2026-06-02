package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.User;
import com.company.ecommerce.rest.dto.CustomerResponse;
import com.company.ecommerce.rest.dto.OrderResponse;
import com.company.ecommerce.rest.dto.PaginatedResponse;
import com.company.ecommerce.rest.repository.OrderRepoImpl;
import com.company.ecommerce.rest.repository.UserRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserRepoImpl userRepo;
    private final OrderRepoImpl orderRepo;

    public CustomerController(UserRepoImpl userRepo, OrderRepoImpl orderRepo) {
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
    }

    @GetMapping
    public ResponseEntity<?> getCustomers(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "20") int limit,
            @RequestParam(required = false) String search) {

        List<User> allUsers = userRepo.findAll();
        List<User> customers = allUsers.stream()
                .filter(u -> u.getRoles().contains("CUSTOMER"))
                .filter(u -> search == null || search.isEmpty() ||
                        u.getUsername().toLowerCase().contains(search.toLowerCase()) ||
                        (u.getEmail() != null && u.getEmail().toLowerCase().contains(search.toLowerCase())) ||
                        (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(search.toLowerCase())))
                .toList();

        int total = customers.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<User> paged = start < total ? customers.subList(start, end) : new ArrayList<>();

        List<CustomerResponse> response = paged.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        }
        return ResponseEntity.ok(toResponse(user.get()));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getCustomerOrders(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "12") int limit) {
        List<com.company.ecommerce.model.Order> orders = orderRepo.findByCustomerId(id);
        int total = orders.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<com.company.ecommerce.model.Order> paged = start < total ? orders.subList(start, end) : new ArrayList<>();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        List<OrderResponse> response = paged.stream().map(order -> {
            OrderResponse res = new OrderResponse();
            res.setId(order.getId());
            res.setStatus(order.getStatus());
            res.setOrderId("ORD-" + String.format("%08d", order.getId()));
            res.setCustomerName(order.getCustomerName());
            res.setPaymentMethod(order.getPaymentMethod());
            if (order.getCreatedAt() != null) {
                res.setCreatedAt(order.getCreatedAt().format(fmt));
            }
            return res;
        }).toList();
        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    private CustomerResponse toResponse(User user) {
        CustomerResponse response = new CustomerResponse();
        response.setId(user.getId());
        response.setName(user.getFirstName() != null ? user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "") : user.getUsername());
        response.setFullName((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : ""));
        response.setEmail(user.getEmail() != null ? user.getEmail() : user.getUsername());
        response.setPhone(user.getPhone());
        if (user.getCreatedAt() != null) {
            response.setCreatedAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        String role = user.getRoles().isEmpty() ? "CUSTOMER" : user.getRoles().get(0);
        response.setRole("ROLE_" + role);
        return response;
    }
}
