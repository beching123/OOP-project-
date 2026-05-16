package com.company.ecommerce.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.vaadin.flow.server.ServiceInitEvent;
import com.vaadin.flow.server.VaadinServiceInitListener;

@Configuration
public class VaadinConfig {

    @Bean
    public VaadinServiceInitListener vaadinServiceInitListener(GlobalExceptionHandler errorHandler) {
        return new VaadinServiceInitListener() {
            @Override
            public void serviceInit(ServiceInitEvent event) {
                event.addErrorHandler(errorHandler);
            }
        };
    }

    @Bean
    public AppTheme appTheme(com.company.ecommerce.service.ConfigService configService) {
        return new AppTheme(configService);
    }
}
