package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.StaffMessage;
import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.repository.StaffMessageRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/messages")
public class StaffMessageController {

    private final StaffMessageRepoImpl messageRepo;
    private final JwtUtil jwtUtil;

    public StaffMessageController(StaffMessageRepoImpl messageRepo, JwtUtil jwtUtil) {
        this.messageRepo = messageRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getConversations(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        List<StaffMessage> messages = messageRepo.findConversations(userId);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<Map<String, Object>> response = messages.stream().map(m -> {
            Long partnerId = m.getSenderId().equals(userId) ? m.getRecipientId() : m.getSenderId();
            String partnerName = m.getSenderId().equals(userId) ? m.getRecipientName() : m.getSenderName();
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("partnerId", partnerId);
            map.put("partnerName", partnerName);
            map.put("lastMessage", m.getMessage());
            map.put("lastMessageTime", m.getCreatedAt() != null ? m.getCreatedAt().format(fmt) : null);
            map.put("isRead", m.isRead());
            map.put("unreadFromPartner", !m.isRead() && m.getSenderId().equals(partnerId));
            return map;
        }).toList();

        int unread = messageRepo.countUnread(userId);
        return ResponseEntity.ok(Map.of("conversations", response, "unreadCount", unread));
    }

    @GetMapping("/{partnerId}")
    public ResponseEntity<?> getConversation(
            @PathVariable Long partnerId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(defaultValue = "50") int limit) {

        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        List<StaffMessage> messages = messageRepo.findConversation(userId, partnerId, limit);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<Map<String, Object>> response = messages.stream().map(m -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", m.getId());
            map.put("senderId", m.getSenderId());
            map.put("senderName", m.getSenderName());
            map.put("recipientId", m.getRecipientId());
            map.put("recipientName", m.getRecipientName());
            map.put("message", m.getMessage());
            map.put("read", m.isRead());
            map.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().format(fmt) : null);
            return map;
        }).toList();

        messageRepo.markAsRead(partnerId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {

        Long senderId = extractUserId(authHeader);
        if (senderId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        String senderName = body.getOrDefault("senderName", "").toString();
        Long recipientId = Long.valueOf(body.get("recipientId").toString());
        String recipientName = body.getOrDefault("recipientName", "").toString();
        String message = body.getOrDefault("message", "").toString();

        if (message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        StaffMessage msg = new StaffMessage(null, senderId, senderName, recipientId, recipientName, message, false, LocalDateTime.now());
        StaffMessage saved = messageRepo.save(msg);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "senderId", saved.getSenderId(),
                "senderName", saved.getSenderName(),
                "recipientId", saved.getRecipientId(),
                "recipientName", saved.getRecipientName(),
                "message", saved.getMessage(),
                "createdAt", saved.getCreatedAt() != null ? saved.getCreatedAt().format(fmt) : null
        ));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        int count = messageRepo.countUnread(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
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
