package com.company.ecommerce.rest.controller;

import com.company.ecommerce.rest.dto.PaymentRequest;
import com.company.ecommerce.rest.dto.PaymentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody PaymentRequest request) {
        if (request.getOrderId() == null || request.getMethodId() == null || request.getAmount() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        PaymentResponse response = new PaymentResponse();
        response.setTransactionId(transactionId);
        response.setStatus("pending");
        response.setOrderId(String.valueOf(request.getOrderId()));
        response.setAmount(request.getAmount());
        response.setMessage("Payment initiated successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        String transactionId = request.get("transactionId");
        if (transactionId == null || transactionId.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing transactionId"));
        }

        PaymentResponse response = new PaymentResponse();
        response.setTransactionId(transactionId);
        response.setStatus("completed");
        response.setMessage("Payment verified successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods() {
        return ResponseEntity.ok(java.util.List.of(
            Map.of("id", "mtn_momo", "name", "MTN Mobile Money", "icon", "Smartphone", "description", "Pay with MTN Mobile Money", "enabled", true),
            Map.of("id", "orange_money", "name", "Orange Money", "icon", "Smartphone", "description", "Pay with Orange Money", "enabled", true),
            Map.of("id", "bank_card", "name", "Bank Card", "icon", "CreditCard", "description", "Pay with Visa, Mastercard", "enabled", true),
            Map.of("id", "cash_on_delivery", "name", "Cash on Delivery", "icon", "Banknote", "description", "Pay when you receive your order", "enabled", true)
        ));
    }
}
