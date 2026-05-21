// package declaration for this source file
package com.company.ecommerce.integration;

// imported type required by this class
import org.slf4j.Logger;
// imported type required by this class
import org.slf4j.LoggerFactory;
// imported type required by this class
import org.springframework.stereotype.Component;

/**
 * EmailProviderImpl — simple email delivery implementation used for skeleton wiring.
 *
 * <p>In a production system this would connect to an SMTP gateway or email API.
 */
@Component
public class EmailProviderImpl implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(EmailProviderImpl.class);

    // annotation applied to the following declaration
    @Override
    // method declaration for sendEmail
    public void sendEmail(String to, String subject, String htmlBody) {
        logger.info("Sending email to {} with subject {}", to, subject);
    }
}
