// package declaration for this source file
package com.company.ecommerce.ui.views.customer;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "cart", layout = MainLayout.class)
/**
 * PersistentCartView — customer shopping cart page.
 *
 * <p>This view shows items the customer has added to their cart before checkout.
 */
public class PersistentCartView extends VerticalLayout {

    // method declaration for PersistentCartView
    public PersistentCartView() {
        add("Persistent cart placeholder");
    }
}
