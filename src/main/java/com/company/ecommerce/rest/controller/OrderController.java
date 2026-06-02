package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.Order;
import com.company.ecommerce.model.OrderItem;
import com.company.ecommerce.model.Product;
import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.dto.*;
import com.company.ecommerce.rest.repository.OrderRepoImpl;
import com.company.ecommerce.rest.repository.ProductRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepoImpl orderRepo;
    private final ProductRepoImpl productRepo;
    private final JwtUtil jwtUtil;

    public OrderController(OrderRepoImpl orderRepo, ProductRepoImpl productRepo, JwtUtil jwtUtil) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "20") int limit) {

        List<Order> orders;
        if (status != null && !status.isEmpty()) {
            orders = orderRepo.findByStatus(status);
        } else {
            orders = orderRepo.findAll();
        }

        int total = orders.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<Order> paged = start < total ? orders.subList(start, end) : new ArrayList<>();

        List<OrderResponse> response = paged.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam(required = false, defaultValue = "1") int page,
                                          @RequestParam(required = false, defaultValue = "12") int limit) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        List<Order> orders = orderRepo.findByCustomerId(userId);
        int total = orders.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<Order> paged = start < total ? orders.subList(start, end) : new ArrayList<>();

        List<OrderResponse> response = paged.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable String orderNumber) {
        Optional<Order> orderOpt = orderRepo.findByOrderNumber(orderNumber);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
        }
        return ResponseEntity.ok(toResponse(orderOpt.get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        Optional<Order> order = orderRepo.findById(id);
        if (order.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
        }
        return ResponseEntity.ok(toResponse(order.get()));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                         @RequestBody OrderRequest request) {
        Long customerId = extractUserId(authHeader);
        if (customerId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        Order order = new Order();
        order.setStatus(Order.STATUS_DRAFT);
        order.setCustomerId(customerId);
        if (request.getPayment() != null && request.getPayment().getMethodId() != null) {
            order.setPaymentMethod(request.getPayment().getMethodId());
        }
        if (request.getDelivery() != null) {
            String addr = "";
            if (request.getDelivery().getRegion() != null) addr += request.getDelivery().getRegion();
            if (request.getDelivery().getCity() != null) addr += ", " + request.getDelivery().getCity();
            if (request.getDelivery().getCheckpointId() != null) addr += " - " + request.getDelivery().getCheckpointId();
            order.setShippingAddress(addr.trim());
            order.setDeliveryMethod(request.getDelivery().getMethod());
        }

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
                Optional<Product> productOpt = productRepo.findById(itemReq.getId());
                if (productOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Product not found: " + itemReq.getId()));
                }
                Product product = productOpt.get();
                OrderItem item = new OrderItem();
                item.setProductId(product.getId());
                item.setProductName(product.getName());
                item.setQuantity(itemReq.getQuantity());
                item.setUnitPrice(product.getPrice());
                item.setImageUrl(product.getImageUrl());
                items.add(item);
                subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            }
        }

        order.setItems(items);
        order.setSubtotal(subtotal);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.195));
        order.setTotal(subtotal.add(tax));
        order.setTax(tax);

        Order saved = orderRepo.save(order);

        OrderResponse response = toResponse(saved);
        response.setOrderId("ORD-" + String.format("%08d", saved.getId()));
        response.setTrackingNumber("TRD-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());

        return ResponseEntity.status(201).body(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id, @RequestBody StatusUpdateRequest request) {

        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        Optional<Order> orderOpt = orderRepo.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setStatus(request.getStatus());
        orderRepo.save(order);

        return ResponseEntity.ok(toResponse(order));
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderId(order.getId() != null ? "ORD-" + String.format("%08d", order.getId()) : null);
        response.setTrackingNumber("TRD-" + (order.getId() != null ? String.format("%010d", order.getId()) : "0000000000"));
        response.setStatus(order.getStatus());
        response.setCustomerName(order.getCustomerName());
        response.setPaymentMethod(order.getPaymentMethod());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (order.getCreatedAt() != null) {
            response.setCreatedAt(order.getCreatedAt().format(fmt));
        }

        List<OrderResponse.OrderItemResponse> items = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                OrderResponse.OrderItemResponse itemRes = new OrderResponse.OrderItemResponse();
                itemRes.setId(item.getProductId());
                itemRes.setName(item.getProductName());
                itemRes.setPrice(item.getUnitPrice());
                itemRes.setQuantity(item.getQuantity());
                itemRes.setLineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                itemRes.setImage(item.getImageUrl());
                items.add(itemRes);
            }
        }
        response.setItems(items);

        OrderResponse.OrderTotals totals = new OrderResponse.OrderTotals();
        BigDecimal sub = order.getSubtotal() != null ? order.getSubtotal() : (order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO);
        totals.setSubtotal(sub);
        totals.setSavings(BigDecimal.ZERO);
        totals.setDiscountedSubtotal(sub);
        totals.setShippingCost(BigDecimal.valueOf(1000));
        totals.setTotal(order.getTotal() != null ? order.getTotal().add(BigDecimal.valueOf(1000)) : BigDecimal.ZERO);
        response.setTotals(totals);

        return response;
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
