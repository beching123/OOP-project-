// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.slf4j.Logger;
// imported type required by this class
import org.slf4j.LoggerFactory;
// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.StaleDataException;
// imported type required by this class
import com.vaadin.flow.server.ErrorEvent;
// imported type required by this class
import com.vaadin.flow.server.ErrorHandler;
// imported type required by this class
import com.vaadin.flow.component.notification.Notification;

/**
 * GlobalExceptionHandler — centralized Vaadin error handler for UI exceptions.
 *
 * <p>It displays friendly user notifications for known recovery cases and logs
 * unexpected errors for later debugging.
 */
@Component
public class GlobalExceptionHandler implements ErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // annotation applied to the following declaration
    @Override
    // method declaration for error
    public void error(ErrorEvent event) {
        Throwable throwable = event.getThrowable();
        // conditional check
        if (throwable instanceof StaleDataException || throwable.getCause() instanceof StaleDataException) {
            Notification.show("Data modified by another user. Refresh and try again.", 5000, Notification.Position.MIDDLE);
        } else {
            logger.error("Unhandled error in Vaadin application", throwable);
            Notification.show("Unexpected error, contact support.", 5000, Notification.Position.MIDDLE);
        }
    }
}
