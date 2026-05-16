package com.company.ecommerce.ui.views.customer;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "cart", layout = MainLayout.class)
public class PersistentCartView extends VerticalLayout {

    public PersistentCartView() {
        add("Persistent cart placeholder");
    }
}
