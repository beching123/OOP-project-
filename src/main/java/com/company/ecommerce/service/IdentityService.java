// package declaration for this source file
package com.company.ecommerce.service;

// imported type required by this class
import com.company.ecommerce.model.AccessDeniedException;
// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * IdentityService — authentication and authorization operations.
 *
 * <p>Implementations should delegate to a secure credential store and provide role/permission
 * checks used across the application.
 */
public interface IdentityService {

    /**
     * Authenticate a user by username/password and return the `User` object if successful.
     *
     * @throws AccessDeniedException when credentials are invalid
     */
    User authenticate(String username, String password) throws AccessDeniedException;

    /**
     * Assert that the given `user` has the specified permission. Throws
     * `AccessDeniedException` when the check fails.
     */
    void assertPermission(User user, String permission) throws AccessDeniedException;
}
