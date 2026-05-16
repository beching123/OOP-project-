package com.company.ecommerce.ui.views;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.FlexComponent.Alignment;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.RouterLink;

public class MainLayout extends AppLayout {

    public MainLayout() {
        createHeader();
        createDrawer();
    }

    private void createHeader() {
        H1 title = new H1("Madam E-Commerce");
        title.getStyle().set("font-size", "1.5em");
        HorizontalLayout header = new HorizontalLayout(title);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        addToNavbar(header);
    }

    private void createDrawer() {
        VerticalLayout menu = new VerticalLayout();
        menu.add(new RouterLink("Login", LoginView.class));
        addToDrawer(menu);
    }
}
