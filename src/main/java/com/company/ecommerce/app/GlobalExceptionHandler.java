package com.company.ecommerce.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.company.ecommerce.model.StaleDataException;
import com.vaadin.flow.server.ErrorEvent;
import com.vaadin.flow.server.ErrorHandler;
import com.vaadin.flow.component.notification.Notification;

@Component
public class GlobalExceptionHandler implements ErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Override
    public void error(ErrorEvent event) {
        Throwable throwable = event.getThrowable();
        if (throwable instanceof StaleDataException || throwable.getCause() instanceof StaleDataException) {
            Notification.show("Data modified by another user. Refresh and try again.", 5000, Notification.Position.MIDDLE);
        } else {
            logger.error("Unhandled error in Vaadin application", throwable);
            Notification.show("Unexpected error, contact support.", 5000, Notification.Position.MIDDLE);
        }
    }
}
