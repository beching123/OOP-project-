package com.company.ecommerce.service;

import com.company.ecommerce.model.AccessDeniedException;
import com.company.ecommerce.model.User;

public interface IdentityService {

    User authenticate(String username, String password) throws AccessDeniedException;

    void assertPermission(User user, String permission) throws AccessDeniedException;
}
