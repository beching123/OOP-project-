package com.company.ecommerce.ui.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("login")
public class LoginView extends VerticalLayout {

    public LoginView() {
        LoginForm loginForm = new LoginForm();
        Button loginButton = new Button("Login");
        add(loginForm, loginButton);
    }
}
