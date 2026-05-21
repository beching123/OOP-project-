// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.model.User;
// imported type required by this class
import com.vaadin.flow.server.VaadinSession;

/**
 * SessionManager — helper for storing and retrieving the current authenticated user
 * in Vaadin session scope.
 *
 * <p>This class encapsulates Vaadin session APIs to keep UI code decoupled from
 * session attribute details.
 */
@Component
public class SessionManager {

    // annotation applied to the following declaration
    @SuppressWarnings("unused")
    private static final String CURRENT_USER_KEY = SessionManager.class.getName() + ".currentUser";

    // method declaration for getCurrentUser
    public User getCurrentUser() {
        VaadinSession session = VaadinSession.getCurrent();
        // conditional check
        if (session == null) {
            // return statement from method
            return null;
        }
        // return statement from method
        return session.getAttribute(User.class);
    }

    // method declaration for setCurrentUser
    public void setCurrentUser(User user) {
        VaadinSession session = VaadinSession.getCurrent();
        // conditional check
        if (session != null) {
            session.setAttribute(User.class, user);
        }
    }

    // method declaration for clear
    public void clear() {
        VaadinSession session = VaadinSession.getCurrent();
        // conditional check
        if (session != null) {
            session.close();
        }
    }
}
