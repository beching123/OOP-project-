// package declaration for this source file
package com.company.ecommerce.ui.views.admin;

// imported type required by this class
import com.company.ecommerce.ui.views.MainLayout;
// imported type required by this class
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
// imported type required by this class
import com.vaadin.flow.router.Route;

// annotation applied to the following declaration
@Route(value = "admin/audit", layout = MainLayout.class)
/**
 * AuditLogViewer — admin page for reviewing the audit trail.
 *
 * <p>This view is intended to show security and order audit entries.
 */
public class AuditLogViewer extends VerticalLayout {

    // method declaration for AuditLogViewer
    public AuditLogViewer() {
        add("Audit log viewer placeholder");
    }
}
