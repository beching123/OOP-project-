// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.springframework.boot.SpringApplication;
// imported type required by this class
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WebLauncher — Spring Boot application entry point.
 *
 * <p>Starting this class launches the embedded web server and initializes the
 * Spring/Vaadin application context.
 */
@SpringBootApplication
public class WebLauncher {

    // method declaration for main
    public static void main(String[] args) {
        SpringApplication.run(WebLauncher.class, args);
    }
}
