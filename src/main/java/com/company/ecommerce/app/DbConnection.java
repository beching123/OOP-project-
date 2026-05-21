// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import java.sql.Connection;
// imported type required by this class
import java.sql.DriverManager;
// imported type required by this class
import java.sql.SQLException;

// imported type required by this class
import org.springframework.beans.factory.annotation.Value;
// imported type required by this class
import org.springframework.stereotype.Component;

/**
 * DbConnection — low-level JDBC connection manager.
 *
 * <p>This class holds a thread-local connection and provides utility methods for
 * obtaining and removing the current database connection.
 */
@Component
public class DbConnection {

    // create or update a collection or object
    private static final ThreadLocal<Connection> CONNECTION_HOLDER = new ThreadLocal<>();

    // annotation applied to the following declaration
    @Value("${spring.datasource.url}")
    // field declaration for url
    private String url;

    // annotation applied to the following declaration
    @Value("${spring.datasource.username}")
    // field declaration for username
    private String username;

    // annotation applied to the following declaration
    @Value("${spring.datasource.password}")
    // field declaration for password
    private String password;

    // annotation applied to the following declaration
    @Value("${spring.datasource.driver-class-name}")
    // field declaration for driverClassName
    private String driverClassName;

    // method declaration for method
    /**
     * Return the current thread-local JDBC connection, opening one if necessary.
     *
     * <p>The caller is responsible for committing or rolling back the transaction.
     */
    public static Connection getConnection() throws SQLException {
        Connection connection = CONNECTION_HOLDER.get();
        // conditional check
        if (connection == null || connection.isClosed()) {
            // start a try block for error handling
            try {
                connection = DriverManager.getConnection(getUrl(), getUsername(), getPassword());
                CONNECTION_HOLDER.set(connection);
            } catch (SQLException e) {
                // throw an exception for invalid state
                throw e;
            }
        }
        // return statement from method
        return connection;
    }

    /**
     * Close and remove the current thread-local JDBC connection.
     */
    public static void remove() {
        Connection connection = CONNECTION_HOLDER.get();
        // conditional check
        if (connection != null) {
            // start a try block for error handling
            try {
                connection.close();
            } catch (SQLException ignored) {
                // ignore close errors
            }
            CONNECTION_HOLDER.remove();
        }
    }

    // method declaration for getUrl
    private static String getUrl() {
        // return statement from method
        return ApplicationPropertiesHolder.getUrl();
    }

    // method declaration for getUsername
    private static String getUsername() {
        // return statement from method
        return ApplicationPropertiesHolder.getUsername();
    }

    // method declaration for getPassword
    private static String getPassword() {
        // return statement from method
        return ApplicationPropertiesHolder.getPassword();
    }

    static class ApplicationPropertiesHolder {
        // field declaration for url
        private static String url;
        // field declaration for username
        private static String username;
        // field declaration for password
        private static String password;

        // method declaration for setProperties
        static void setProperties(String urlValue, String usernameValue, String passwordValue) {
            url = urlValue;
            username = usernameValue;
            password = passwordValue;
        }

        // method declaration for getUrl
        static String getUrl() {
            // return statement from method
            return url;
        }

        // method declaration for getUsername
        static String getUsername() {
            // return statement from method
            return username;
        }

        // method declaration for getPassword
        static String getPassword() {
            // return statement from method
            return password;
        }
    }

    public DbConnection(@Value("${spring.datasource.url}") String url,
                        // annotation applied to the following declaration
                        @Value("${spring.datasource.username}") String username,
                        // annotation applied to the following declaration
                        @Value("${spring.datasource.password}") String password) {
        ApplicationPropertiesHolder.setProperties(url, username, password);
    }
}
