package com.company.ecommerce.app;

import org.springframework.stereotype.Component;

import com.company.ecommerce.model.User;
import com.vaadin.flow.server.VaadinSession;

@Component
public class SessionManager {

    private static final String CURRENT_USER_KEY = SessionManager.class.getName() + ".currentUser";

    public User getCurrentUser() {
        VaadinSession session = VaadinSession.getCurrent();
        if (session == null) {
            return null;
        }
        return session.getAttribute(User.class);
    }

    public void setCurrentUser(User user) {
        VaadinSession session = VaadinSession.getCurrent();
        if (session != null) {
            session.setAttribute(User.class, user);
        }
    }

    public void clear() {
        VaadinSession session = VaadinSession.getCurrent();
        if (session != null) {
            session.close();
        }
    }
}
