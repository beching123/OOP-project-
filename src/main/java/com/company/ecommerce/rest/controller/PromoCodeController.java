package com.company.ecommerce.rest.controller;

import com.company.ecommerce.rest.repository.PromoCodeRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/promo")
public class PromoCodeController {

    private final PromoCodeRepoImpl promoCodeRepo;

    public PromoCodeController(PromoCodeRepoImpl promoCodeRepo) {
        this.promoCodeRepo = promoCodeRepo;
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validatePromoCode(@PathVariable String code,
                                                @RequestParam(defaultValue = "0") BigDecimal orderTotal) {
        Map<String, Object> promo = promoCodeRepo.findByCode(code);
        if (promo == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Invalid promo code"));
        }
        boolean valid = promoCodeRepo.validate(code, orderTotal);
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("error", "Promo code cannot be applied", "promo", promo));
        }
        return ResponseEntity.ok(Map.of("valid", true, "promo", promo));
    }

    @PostMapping("/apply/{code}")
    public ResponseEntity<?> applyPromoCode(@PathVariable String code) {
        promoCodeRepo.incrementUsage(code);
        return ResponseEntity.ok(Map.of("message", "Promo code applied"));
    }
}
