// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import java.sql.Connection;
// imported type required by this class
import java.sql.SQLException;

// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.StaleDataException;

/**
 * TransactionManager — simple JDBC transaction coordinator.
 *
 * <p>It manages commit/rollback behavior and retries on optimistic locking conflicts
 * by rerunning the enclosed task up to three times.
 */
@Component("jdbcTransactionManager")
public class TransactionManager {

    // method declaration for method
    public void begin() throws SQLException {
        Connection connection = DbConnection.getConnection();
        connection.setAutoCommit(false);
    }

    // method declaration for method
    public void commit() throws SQLException {
        Connection connection = DbConnection.getConnection();
        // start a try block for error handling
        try {
            connection.commit();
        } finally {
            DbConnection.remove();
        }
    }

    // method declaration for method
    public void rollback() throws SQLException {
        Connection connection = DbConnection.getConnection();
        // start a try block for error handling
        try {
            connection.rollback();
        } finally {
            DbConnection.remove();
        }
    }

    /**
     * Execute the given task inside a JDBC transaction.
     *
     * <p>If a {@link com.company.ecommerce.model.StaleDataException} occurs, the transaction
     * is rolled back and retried up to three times.
     */
    public void executeInTransaction(RunnableWithException task) throws Exception {
        int attempts = 0;
        // loop until condition becomes false
        while (true) {
            // start a try block for error handling
            try {
                begin();
                task.run();
                commit();
                return;
            } catch (StaleDataException conflict) {
                attempts++;
                // conditional check
                if (attempts >= 3) {
                    rollback();
                    // throw an exception for invalid state
                    throw conflict;
                }
                // start a try block for error handling
                try {
                    rollback();
                } catch (SQLException ignored) {
                    // ignore rollback failure during retry
                }
            } catch (Exception ex) {
                // start a try block for error handling
                try {
                    rollback();
                } catch (SQLException ignored) {
                    // ignore rollback failure
                }
                // throw an exception for invalid state
                throw ex;
            }
        }
    }

    /**
     * Functional interface for transactional work that may throw checked exceptions.
     */
    public interface RunnableWithException {
        void run() throws Exception;
    }
}
