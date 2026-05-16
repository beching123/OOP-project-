package com.company.ecommerce.app;

import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.stereotype.Component;

import com.company.ecommerce.model.StaleDataException;

@Component
public class TransactionManager {

    public void begin() throws SQLException {
        Connection connection = DbConnection.getConnection();
        connection.setAutoCommit(false);
    }

    public void commit() throws SQLException {
        Connection connection = DbConnection.getConnection();
        try {
            connection.commit();
        } finally {
            DbConnection.remove();
        }
    }

    public void rollback() throws SQLException {
        Connection connection = DbConnection.getConnection();
        try {
            connection.rollback();
        } finally {
            DbConnection.remove();
        }
    }

    public void executeInTransaction(RunnableWithException task) throws Exception {
        int attempts = 0;
        while (true) {
            try {
                begin();
                task.run();
                commit();
                return;
            } catch (StaleDataException conflict) {
                attempts++;
                if (attempts >= 3) {
                    rollback();
                    throw conflict;
                }
                try {
                    rollback();
                } catch (SQLException ignored) {
                    // ignore rollback failure during retry
                }
            } catch (Exception ex) {
                try {
                    rollback();
                } catch (SQLException ignored) {
                    // ignore rollback failure
                }
                throw ex;
            }
        }
    }

    public interface RunnableWithException {
        void run() throws Exception;
    }
}
