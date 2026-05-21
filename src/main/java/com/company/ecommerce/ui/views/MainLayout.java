// package declaration for this source file
package com.company.ecommerce.ui.views;

// imported type required by this class
import com.vaadin.flow.component.applayout.AppLayout;
// imported type required by this class
import com.vaadin.flow.component.html.H1;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.FlexComponent.Alignment;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.RouterLink;

/**
 * MainLayout — shared application layout used by routed views.
 *
 * <p>It defines the common header and navigation drawer for all pages.
 */
public class MainLayout extends AppLayout {

    // method declaration for MainLayout
    public MainLayout() {
        createHeader();
        createDrawer();
    }

    // method declaration for createHeader
    private void createHeader() {
        // create or update a collection or object
        H1 title = new H1("Madam E-Commerce");
        title.getStyle().set("font-size", "1.5em");
        // create or update a collection or object
        HorizontalLayout header = new HorizontalLayout(title);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        addToNavbar(header);
    }

    // method declaration for createDrawer
    private void createDrawer() {
        // create or update a collection or object
        VerticalLayout menu = new VerticalLayout();
        // create or update a collection or object
        menu.add(new RouterLink("Login", LoginView.class));
        addToDrawer(menu);
    }
}
