// package declaration for this source file
package com.company.ecommerce.ui.views.customer;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "store", layout = MainLayout.class)
/**
 * StorefrontView — main customer catalog page.
 *
 * <p>Customers browse products here before adding them to a cart.
 */
public class StorefrontView extends VerticalLayout {

    // method declaration for StorefrontView
    public StorefrontView() {
        add("Storefront placeholder");
    }
}
