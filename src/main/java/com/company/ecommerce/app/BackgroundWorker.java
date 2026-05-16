package com.company.ecommerce.app;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class BackgroundWorker {

    private static final Logger logger = LoggerFactory.getLogger(BackgroundWorker.class);
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    public void submit(Runnable task) {
        executorService.submit(() -> {
            try {
                task.run();
            } catch (Throwable ex) {
                logger.error("Background task failed", ex);
            }
        });
    }
}
