package com.company.ecommerce.ui.views.customer;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "receipt/:orderId", layout = MainLayout.class)
public class ReceiptView extends VerticalLayout {

    public ReceiptView() {
        add("Receipt placeholder");
    }
}
