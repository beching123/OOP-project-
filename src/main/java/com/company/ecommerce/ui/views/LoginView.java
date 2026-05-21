// package declaration for this source file
package com.company.ecommerce.ui.views;

// imported type required by this class
import com.vaadin.flow.component.button.Button;
// imported type required by this class
import com.vaadin.flow.component.login.LoginForm;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route("login")
/**
 * LoginView — authentication page for users to sign in.
 *
 * <p>This skeleton view contains a placeholder login form and demonstrates the login route.
 */
public class LoginView extends VerticalLayout {

    // method declaration for LoginView
    public LoginView() {
        // create or update a collection or object
        LoginForm loginForm = new LoginForm();
        // create or update a collection or object
        Button loginButton = new Button("Login");
        add(loginForm, loginButton);
    }
}
