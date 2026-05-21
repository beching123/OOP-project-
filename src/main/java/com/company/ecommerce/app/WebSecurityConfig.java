// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.vaadin.flow.spring.security.VaadinWebSecurity;
// imported type required by this class
import com.company.ecommerce.ui.views.LoginView;

/**
 * WebSecurityConfig — application security configuration for Vaadin routes.
 *
 * <p>This class defines protected paths and the login view, keeping route-level
 * authorization rules in one place.
 */
@Component
public class WebSecurityConfig extends VaadinWebSecurity {

    // annotation applied to the following declaration
    @Override
    // method declaration for method
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
