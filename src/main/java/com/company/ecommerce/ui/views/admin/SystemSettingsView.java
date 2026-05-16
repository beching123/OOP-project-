package com.company.ecommerce.ui.views.admin;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "admin/settings", layout = MainLayout.class)
public class SystemSettingsView extends VerticalLayout {

    public SystemSettingsView() {
        add("System settings placeholder");
    }
}
