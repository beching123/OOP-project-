// package declaration for this source file
package com.company.ecommerce.integration;

/**
 * EmailProvider — abstraction for outbound email delivery.
 *
 * <p>Implementations may route through an SMTP service or cloud email API.
 */
public interface EmailProvider {

    /**
     * Send an HTML email to the given recipient.
     */
    void sendEmail(String to, String subject, String htmlBody);
}
