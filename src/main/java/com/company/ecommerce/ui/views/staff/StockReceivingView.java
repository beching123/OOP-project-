// package declaration for this source file
package com.company.ecommerce.ui.views.staff;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "stock-receive", layout = MainLayout.class)
/**
 * StockReceivingView — staff page for receiving and stocking new inventory.
 *
 * <p>This skeleton view demonstrates where stock receipt workflows will be built.
 */
public class StockReceivingView extends VerticalLayout {

    // method declaration for StockReceivingView
    public StockReceivingView() {
        add("Stock receiving placeholder");
    }
}
