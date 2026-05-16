package com.company.ecommerce.ui.views.admin;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "admin", layout = MainLayout.class)
public class AdminDashboardView extends VerticalLayout {

    public AdminDashboardView() {
        add("Admin dashboard placeholder");
    }
}
