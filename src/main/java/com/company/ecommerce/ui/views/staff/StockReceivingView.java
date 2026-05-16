package com.company.ecommerce.ui.views.staff;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "stock-receive", layout = MainLayout.class)
public class StockReceivingView extends VerticalLayout {

    public StockReceivingView() {
        add("Stock receiving placeholder");
    }
}
