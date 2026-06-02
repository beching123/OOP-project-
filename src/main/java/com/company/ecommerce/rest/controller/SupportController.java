package com.company.ecommerce.rest.controller;

import com.company.ecommerce.model.SupportTicket;
import com.company.ecommerce.rest.auth.JwtUtil;
import com.company.ecommerce.rest.dto.*;
import com.company.ecommerce.rest.repository.SupportTicketRepoImpl;
import com.company.ecommerce.rest.repository.UserRepoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportTicketRepoImpl ticketRepo;
    private final JwtUtil jwtUtil;
    private final UserRepoImpl userRepo;

    public SupportController(SupportTicketRepoImpl ticketRepo, JwtUtil jwtUtil, UserRepoImpl userRepo) {
        this.ticketRepo = ticketRepo;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "20") int limit) {

        List<SupportTicket> tickets;
        if (customerId != null) {
            tickets = ticketRepo.findByCustomerId(customerId);
        } else if (status != null && !status.isEmpty()) {
            tickets = ticketRepo.findByStatus(status);
        } else {
            tickets = ticketRepo.findAll();
        }

        if (priority != null && !priority.isEmpty()) {
            tickets = tickets.stream()
                    .filter(t -> t.getPriority().equals(priority))
                    .toList();
        }

        int total = tickets.size();
        int pages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<SupportTicket> paged = start < total ? tickets.subList(start, end) : new ArrayList<>();

        List<TicketResponse> response = paged.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(new PaginatedResponse<>(response, total, page, pages, limit));
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<?> getTicket(@PathVariable Long id) {
        Optional<SupportTicket> ticket = ticketRepo.findById(id);
        if (ticket.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Ticket not found"));
        }
        return ResponseEntity.ok(toResponse(ticket.get()));
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> createTicket(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @RequestBody TicketRequest request) {
        Long customerId = null;
        String customerName = "Customer";
        String customerEmail = "";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                customerId = jwtUtil.extractUserId(token);
                if (customerId != null) {
                    var userOpt = userRepo.findById(customerId);
                    if (userOpt.isPresent()) {
                        var user = userOpt.get();
                        customerName = (user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "");
                        customerName = customerName.trim().isEmpty() ? user.getUsername() : customerName;
                        customerEmail = user.getEmail() != null ? user.getEmail() : "";
                    }
                }
            }
        }
        if (customerId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }

        SupportTicket ticket = new SupportTicket();
        ticket.setSubject(request.getSubject());
        ticket.setMessage(request.getMessage());
        ticket.setStatus(SupportTicket.STATUS_OPEN);
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : SupportTicket.PRIORITY_MEDIUM);
        ticket.setCategory(request.getCategory());
        ticket.setOrderNumber(request.getOrderNumber());
        ticket.setCustomerId(customerId);
        ticket.setCustomerName(customerName);
        ticket.setCustomerEmail(customerEmail);
        ticket.setReplies(new ArrayList<>());

        SupportTicket saved = ticketRepo.save(ticket);
        return ResponseEntity.status(201).body(Map.of("id", saved.getId(), "status", "open", "message", "Ticket created successfully"));
    }

    @PostMapping("/tickets/{id}/reply")
    public ResponseEntity<?> replyToTicket(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id, @RequestBody ReplyRequest request) {
        Optional<SupportTicket> ticketOpt = ticketRepo.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Ticket not found"));
        }

        String authorName = "Staff";
        String authorRole = "staff";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.extractUserId(token);
                String role = jwtUtil.extractRole(token);
                authorRole = role != null ? role.toLowerCase() : "staff";
                if (userId != null) {
                    var userOpt = userRepo.findById(userId);
                    if (userOpt.isPresent()) {
                        var user = userOpt.get();
                        String name = ((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim();
                        authorName = name.isEmpty() ? user.getUsername() : name;
                    }
                }
            }
        }

        SupportTicket.Reply reply = new SupportTicket.Reply();
        reply.setMessage(request.getMessage());
        reply.setAuthor(authorName);
        reply.setAuthorRole(authorRole);
        reply.setCreatedAt(LocalDateTime.now());

        ticketRepo.addReply(id, reply);

        return ResponseEntity.ok(reply);
    }

    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Optional<SupportTicket> ticketOpt = ticketRepo.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Ticket not found"));
        }

        ticketRepo.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(Map.of("id", id, "status", request.getStatus()));
    }

    @PatchMapping("/tickets/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Optional<SupportTicket> ticketOpt = ticketRepo.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Ticket not found"));
        }

        Long staffId = request.get("staffId");
        ticketRepo.assignStaff(id, staffId, "Staff #" + staffId);
        return ResponseEntity.ok(Map.of("id", id, "staffId", staffId, "message", "Ticket assigned"));
    }

    private TicketResponse toResponse(SupportTicket ticket) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setSubject(ticket.getSubject());
        response.setMessage(ticket.getMessage());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCustomerId(ticket.getCustomerId());
        response.setCustomerName(ticket.getCustomerName());
        response.setCustomerEmail(ticket.getCustomerEmail());
        response.setStaffId(ticket.getStaffId());
        response.setStaffName(ticket.getStaffName());
        response.setOrderNumber(ticket.getOrderNumber());
        response.setCategory(ticket.getCategory());

        if (ticket.getCreatedAt() != null) {
            response.setCreatedAt(ticket.getCreatedAt().format(fmt));
        }
        if (ticket.getUpdatedAt() != null) {
            response.setUpdatedAt(ticket.getUpdatedAt().format(fmt));
        }

        List<TicketResponse.Reply> replies = new ArrayList<>();
        if (ticket.getReplies() != null) {
            for (SupportTicket.Reply reply : ticket.getReplies()) {
                TicketResponse.Reply replyRes = new TicketResponse.Reply();
                replyRes.setId(reply.getId());
                replyRes.setMessage(reply.getMessage());
                replyRes.setAuthor(reply.getAuthor());
                replyRes.setAuthorRole(reply.getAuthorRole());
                if (reply.getCreatedAt() != null) {
                    replyRes.setCreatedAt(reply.getCreatedAt().format(fmt));
                }
                replies.add(replyRes);
            }
        }
        response.setReplies(replies);

        return response;
    }
}
