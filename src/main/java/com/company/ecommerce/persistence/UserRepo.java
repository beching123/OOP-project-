// package declaration for this source file
package com.company.ecommerce.persistence;

// imported type required by this class
import java.util.List;
// imported type required by this class
import java.util.Optional;

// imported type required by this class
import com.company.ecommerce.model.User;

/**
 * UserRepo — persistence contract for user identity storage.
 *
 * <p>Implementations hide the database technology used and provide lookup/update operations
 * for authentication and user management.
 */
public interface UserRepo {

    /**
     * Find a user by username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Persist a new or updated user record.
     */
    User save(User user);

    /**
     * Update a user's hashed password in storage.
     */
    void updatePassword(Long userId, String newPasswordHash);

    /**
     * Return all known users for administration.
     */
    List<User> findAll();
}
