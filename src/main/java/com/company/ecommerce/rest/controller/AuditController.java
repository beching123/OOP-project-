package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.AuditRecord;
import com.company.ecommerce.persistence.AuditRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/audit")
public class AuditController {

    private final AuditRepo auditRepo;

    public AuditController(AuditRepo auditRepo) {
        this.auditRepo = auditRepo;
    }

    @GetMapping
    public ResponseEntity<?> getAuditRecords(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false, defaultValue = "50") int limit) {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        try {
            if (from != null) fromDate = LocalDateTime.parse(from, fmt);
        } catch (Exception ignored) {}
        try {
            if (to != null) toDate = LocalDateTime.parse(to, fmt);
        } catch (Exception ignored) {}

        List<AuditRecord> records;
        if (fromDate != null || toDate != null || userId != null || action != null) {
            records = auditRepo.findByFilter(fromDate, toDate, userId, action);
        } else {
            records = auditRepo.findRecent(limit);
        }

        List<Map<String, Object>> response = records.stream().map(r -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", r.getId());
            map.put("timestamp", r.getTimestamp() != null ? r.getTimestamp().format(fmt) : null);
            map.put("userId", r.getUserId());
            map.put("username", r.getUserUsername());
            map.put("action", r.getAction());
            map.put("details", r.getDetails());
            map.put("orderId", r.getOrderId());
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> logAudit(@RequestBody Map<String, Object> body) {
        Long userId = body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : 0L;
        String username = body.getOrDefault("username", "system").toString();
        String action = body.getOrDefault("action", "").toString();
        String details = body.getOrDefault("details", "").toString();
        Long orderId = body.get("orderId") != null ? Long.valueOf(body.get("orderId").toString()) : null;

        AuditRecord record = new AuditRecord(null, LocalDateTime.now(), userId, username, action, details, orderId);
        auditRepo.save(record);
        return ResponseEntity.ok(Map.of("message", "Audit logged"));
    }
}
