package com.company.ecommerce.app;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Component;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import com.company.ecommerce.ui.views.LoginView;

@Component
public class WebSecurityConfig extends VaadinWebSecurity {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http.authorizeHttpRequests()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/staff/**").hasAnyRole("CASHIER", "ADMIN")
                .requestMatchers("/customer/**").permitAll()
                .anyRequest().authenticated();
        setLoginView(http, LoginView.class);
    }
}
