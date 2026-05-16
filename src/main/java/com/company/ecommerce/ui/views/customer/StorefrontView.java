package com.company.ecommerce.ui.views.customer;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "store", layout = MainLayout.class)
public class StorefrontView extends VerticalLayout {

    public StorefrontView() {
        add("Storefront placeholder");
    }
}
