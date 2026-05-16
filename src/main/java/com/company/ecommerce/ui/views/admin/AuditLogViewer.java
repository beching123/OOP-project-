package com.company.ecommerce.ui.views.admin;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "admin/audit", layout = MainLayout.class)
public class AuditLogViewer extends VerticalLayout {

    public AuditLogViewer() {
        add("Audit log viewer placeholder");
    }
}
