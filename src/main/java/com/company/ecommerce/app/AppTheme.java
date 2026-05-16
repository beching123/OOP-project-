package com.company.ecommerce.app;

import org.springframework.stereotype.Component;

import com.company.ecommerce.service.ConfigService;

@Component
public class AppTheme {

    public static final String DEFAULT_FONT_SIZE = "18px";
    public static final boolean DEFAULT_CONTRAST = false;
    public static final String DEFAULT_PRIMARY_COLOR = "#2c3e50";

    private final String fontSize;
    private final boolean highContrast;
    private final String primaryColor;

    public AppTheme(ConfigService configService) {
        this.fontSize = configService.get("font_size", DEFAULT_FONT_SIZE);
        this.highContrast = "high".equalsIgnoreCase(configService.get("contrast_mode", DEFAULT_CONTRAST ? "high" : "normal"));
        this.primaryColor = configService.get("primary_color", DEFAULT_PRIMARY_COLOR);
    }

    public String getFontSize() {
        return fontSize;
    }

    public boolean isHighContrast() {
        return highContrast;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }
}
