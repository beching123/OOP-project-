package com.company.ecommerce.ui.views.customer;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "checkout", layout = MainLayout.class)
public class CheckoutView extends VerticalLayout {

    public CheckoutView() {
        add("Checkout placeholder");
    }
}
