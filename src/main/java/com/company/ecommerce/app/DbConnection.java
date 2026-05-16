package com.company.ecommerce.app;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DbConnection {

    private static final ThreadLocal<Connection> CONNECTION_HOLDER = new ThreadLocal<>();

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    public static Connection getConnection() throws SQLException {
        Connection connection = CONNECTION_HOLDER.get();
        if (connection == null || connection.isClosed()) {
            try {
                connection = DriverManager.getConnection(getUrl(), getUsername(), getPassword());
                CONNECTION_HOLDER.set(connection);
            } catch (SQLException e) {
                throw e;
            }
        }
        return connection;
    }

    public static void remove() {
        Connection connection = CONNECTION_HOLDER.get();
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException ignored) {
                // ignore close errors
            }
            CONNECTION_HOLDER.remove();
        }
    }

    private static String getUrl() {
        return ApplicationPropertiesHolder.getUrl();
    }

    private static String getUsername() {
        return ApplicationPropertiesHolder.getUsername();
    }

    private static String getPassword() {
        return ApplicationPropertiesHolder.getPassword();
    }

    static class ApplicationPropertiesHolder {
        private static String url;
        private static String username;
        private static String password;

        static void setProperties(String urlValue, String usernameValue, String passwordValue) {
            url = urlValue;
            username = usernameValue;
            password = passwordValue;
        }

        static String getUrl() {
            return url;
        }

        static String getUsername() {
            return username;
        }

        static String getPassword() {
            return password;
        }
    }

    public DbConnection(@Value("${spring.datasource.url}") String url,
                        @Value("${spring.datasource.username}") String username,
                        @Value("${spring.datasource.password}") String password) {
        ApplicationPropertiesHolder.setProperties(url, username, password);
    }
}
