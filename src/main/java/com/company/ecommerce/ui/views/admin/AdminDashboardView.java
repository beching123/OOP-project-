// package declaration for this source file
package com.company.ecommerce.ui.views.admin;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "admin", layout = MainLayout.class)
/**
 * AdminDashboardView — overview page for administrators.
 *
 * <p>Displays administrative controls and metrics in the admin section.
 */
public class AdminDashboardView extends VerticalLayout {

    // method declaration for AdminDashboardView
    public AdminDashboardView() {
        add("Admin dashboard placeholder");
    }
}
