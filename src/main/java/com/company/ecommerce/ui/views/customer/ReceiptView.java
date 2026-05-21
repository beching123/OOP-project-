// package declaration for this source file
package com.company.ecommerce.ui.views.customer;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "receipt/:orderId", layout = MainLayout.class)
/**
 * ReceiptView — displays the order receipt after checkout.
 *
 * <p>The route includes the order id so the view can render the correct receipt.
 */
public class ReceiptView extends VerticalLayout {

    // method declaration for ReceiptView
    public ReceiptView() {
        add("Receipt placeholder");
    }
}
