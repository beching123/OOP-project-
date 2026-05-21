// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.springframework.context.annotation.Bean;
// imported type required by this class
import org.springframework.context.annotation.Configuration;

// imported type required by this class
import com.vaadin.flow.server.ServiceInitEvent;
// imported type required by this class
import com.vaadin.flow.server.UIInitEvent;
// imported type required by this class
import com.vaadin.flow.server.VaadinServiceInitListener;
// imported type required by this class
import com.company.ecommerce.service.ConfigService;

/**
 * VaadinConfig — application configuration for Vaadin integration.
 *
 * <p>This class registers Vaadin service listeners and UI-level exception handling
 * to centralize framework wiring and provide consistent UI error behavior.
 */
@Configuration
public class VaadinConfig {

    // annotation applied to the following declaration
    @Bean
    // method declaration for vaadinServiceInitListener
    public VaadinServiceInitListener vaadinServiceInitListener(GlobalExceptionHandler errorHandler) {
        // return statement from method
        return new VaadinServiceInitListener() {
            // annotation applied to the following declaration
            @Override
            // method declaration for serviceInit
            public void serviceInit(ServiceInitEvent event) {
                event.getSource().addUIInitListener(this::uiInit);
            }

            // method declaration for uiInit
            private void uiInit(UIInitEvent uiEvent) {
                uiEvent.getUI().addErrorHandler(errorHandler);
            }
        };
    }

    // annotation applied to the following declaration
    @Bean
    // method declaration for appTheme
    public AppTheme appTheme(com.company.ecommerce.service.ConfigService configService) {
        // return statement from method
        return new AppTheme(configService);
    }
}
