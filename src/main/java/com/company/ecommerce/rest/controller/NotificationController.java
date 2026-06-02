package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.Notification;
import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.repository.NotificationRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepoImpl notificationRepo;
    private final JwtUtil jwtUtil;

    public NotificationController(NotificationRepoImpl notificationRepo, JwtUtil jwtUtil) {
        this.notificationRepo = notificationRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(defaultValue = "20") int limit) {

        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        List<Notification> notifications = notificationRepo.findByUserId(userId, limit);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<Map<String, Object>> response = notifications.stream().map(n -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", n.getId());
            map.put("userId", n.getUserId());
            map.put("title", n.getTitle());
            map.put("message", n.getMessage());
            map.put("type", n.getType());
            map.put("referenceId", n.getReferenceId());
            map.put("read", n.isRead());
            map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().format(fmt) : null);
            return map;
        }).toList();

        int unread = notificationRepo.countUnread(userId);
        return ResponseEntity.ok(Map.of("notifications", response, "unreadCount", unread));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        int count = notificationRepo.countUnread(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String title = body.getOrDefault("title", "").toString();
        String message = body.getOrDefault("message", "").toString();
        String type = body.getOrDefault("type", "info").toString();
        Long referenceId = body.get("referenceId") != null ? Long.valueOf(body.get("referenceId").toString()) : null;

        Notification n = new Notification(null, userId, title, message, type, referenceId, false, LocalDateTime.now());
        Notification saved = notificationRepo.save(n);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "Notification created"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationRepo.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        notificationRepo.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
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
