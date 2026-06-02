package com.company.ecommerce.persistence;

import com.company.ecommerce.model.SupportTicket;

import java.util.List;
import java.util.Optional;

public interface SupportTicketRepo {
    Optional<SupportTicket> findById(Long id);
    List<SupportTicket> findAll();
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByStatus(String status);
    SupportTicket save(SupportTicket ticket);
    void updateStatus(Long id, String status);
    void assignStaff(Long id, Long staffId, String staffName);
    void addReply(Long ticketId, SupportTicket.Reply reply);
}
