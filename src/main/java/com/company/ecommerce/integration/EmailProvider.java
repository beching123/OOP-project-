package com.company.ecommerce.integration;

public interface EmailProvider {

    void sendEmail(String to, String subject, String htmlBody);
}
