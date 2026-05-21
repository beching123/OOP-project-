// package declaration for this source file
package com.company.ecommerce.app;

// imported type required by this class
import org.springframework.stereotype.Component;

// imported type required by this class
import com.company.ecommerce.service.ConfigService;

/**
 * AppTheme — theme configuration provider for UI styling options.
 *
 * <p>Reads theme-related settings from the application configuration and exposes
 * them to UI components.
 */
@Component
public class AppTheme {

    // field declaration for "18px"
    public static final String DEFAULT_FONT_SIZE = "18px";
    // field declaration for false
    public static final boolean DEFAULT_CONTRAST = false;
    // field declaration for "#2c3e50"
    public static final String DEFAULT_PRIMARY_COLOR = "#2c3e50";

    // field declaration for fontSize
    private final String fontSize;
    // field declaration for highContrast
    private final boolean highContrast;
    // field declaration for primaryColor
    private final String primaryColor;

    // method declaration for AppTheme
    public AppTheme(ConfigService configService) {
        // assign value to object field
        this.fontSize = configService.get("font_size", DEFAULT_FONT_SIZE);
        // assign value to object field
        this.highContrast = "high".equalsIgnoreCase(configService.get("contrast_mode", DEFAULT_CONTRAST ? "high" : "normal"));
        // assign value to object field
        this.primaryColor = configService.get("primary_color", DEFAULT_PRIMARY_COLOR);
    }

    // method declaration for getFontSize
    public String getFontSize() {
        // return statement from method
        return fontSize;
    }

    // method declaration for isHighContrast
    public boolean isHighContrast() {
        // return statement from method
        return highContrast;
    }

    // method declaration for getPrimaryColor
    public String getPrimaryColor() {
        // return statement from method
        return primaryColor;
    }
}
