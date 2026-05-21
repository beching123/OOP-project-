// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import java.util.concurrent.ExecutorService;
// imported type required by this class
import java.util.concurrent.Executors;

// imported type required by this class
import org.slf4j.Logger;
// imported type required by this class
import org.slf4j.LoggerFactory;
// imported type required by this class
import org.springframework.stereotype.Component;

/**
 * BackgroundWorker — simple executor service for asynchronous tasks.
 *
 * <p>Use this helper for non-blocking work such as email sending, report generation, or
 * logging without delaying the main request thread.
 */
@Component
public class BackgroundWorker {

    private static final Logger logger = LoggerFactory.getLogger(BackgroundWorker.class);
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    // method declaration for submit
    public void submit(Runnable task) {
        executorService.submit(() -> {
            // start a try block for error handling
            try {
                task.run();
            } catch (Throwable ex) {
                logger.error("Background task failed", ex);
            }
        });
    }
}
