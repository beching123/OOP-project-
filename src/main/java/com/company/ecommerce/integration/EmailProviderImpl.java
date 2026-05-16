package com.company.ecommerce.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EmailProviderImpl implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(EmailProviderImpl.class);

    @Override
    public void sendEmail(String to, String subject, String htmlBody) {
        logger.info("Sending email to {} with subject {}", to, subject);
    }
}
