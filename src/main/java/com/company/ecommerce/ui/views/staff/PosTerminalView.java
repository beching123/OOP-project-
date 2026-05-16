package com.company.ecommerce.ui.views.staff;

import com.company.ecommerce.ui.views.MainLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route(value = "pos", layout = MainLayout.class)
public class PosTerminalView extends VerticalLayout {

    public PosTerminalView() {
        add("POS terminal placeholder");
    }
}
