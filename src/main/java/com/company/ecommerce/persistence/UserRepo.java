package com.company.ecommerce.persistence;

import java.util.List;
import java.util.Optional;

import com.company.ecommerce.model.User;

public interface UserRepo {

    Optional<User> findByUsername(String username);

    User save(User user);

    void updatePassword(Long userId, String newPasswordHash);

    List<User> findAll();
}
