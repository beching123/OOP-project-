# 07 – UI Layer: `com.company.ecommerce.ui.views`

## Purpose
Vaadin server‑side UI. Renders the interface in the browser, captures user actions, and delegates everything to services.

## Global Rules
- Every view is a Vaadin component (extend `VerticalLayout`, `HorizontalLayout`, etc.).
- Use constructor injection for services. **No** business logic, no direct database access.
- Catch `StaleDataException` and show a `Notification` – do not leave the user confused.
- Navigation: `UI.getCurrent().navigate(XxxView.class, parameters)` – never hard‑code URL strings.
- Use `AppTheme` values for all dynamic styling (font size, contrast, colors).

## Typography & Accessibility (Madam‑friendly design)
- Minimum font size: 18px for body text, 24px for headings.
- Font family: Sans‑serif (Arial, Roboto, or system default).
- High contrast mode: white background (`#FFFFFF`), black text (`#000000`), buttons have thick borders.
- Colours: primary colour is configurable but defaults to a calm dark blue (`#2c3e50`). Do not use red text on green background (avoid red‑green confusion).
- Buttons: large click area (at least 44×44 CSS pixels).
- Always provide a visible focus indicator on interactive elements.

## Required Views & Their Mandatory Content

### `MainLayout` (extends `AppLayout`, no route)
- Drawer (left sidebar) with `RouterLink` items, filtered by role.
- Header with application title, logged‑in user name, logout button (calls `SessionManager.clear()`).
- The drawer must include: AdminDashboard, SystemSettings, AuditLogViewer (admin); PosTerminal, StockReceiving (staff); Storefront, Cart (customer).

### `LoginView` (`@Route("login")`)
- Username field, password field, login button.
- Calls `IdentityService.authenticate()`, sets user in session, navigates to role‑appropriate view.

### `AdminDashboardView` (`@Route("admin", layout = MainLayout.class)`)
- Daily sales total, number of orders, low‑stock product list (via `TradeService` / `CatalogService`).

### `SystemSettingsView` (`@Route("admin/settings", layout = MainLayout.class)`)
- Editable form: shop name, tax rate, printer port, font size, high contrast toggle.
- Save calls `ConfigService.set()` for each.

### `AuditLogViewer` (`@Route("admin/audit", layout = MainLayout.class)`)
- Grid of audit records with date/user/action filters. Search via `AuditService.search()`.

### `PosTerminalView` (`@Route("pos", layout = MainLayout.class)`)
- Barcode input field (auto‑focus). Cart grid of `OrderItem`. Payment buttons (Cash, MoMo, Orange).
- Barcode scanned → `CatalogService.lookupByBarcode()` → `CartService.addItemToCart()`.
- Payment button → `TradeService.checkout()` → navigate to `ReceiptView`.
- Cancel button → void draft order.
- Must handle `StaleDataException`: show notification, refresh cart.

### `StockReceivingView` (`@Route("stock-receive", layout = MainLayout.class)`)
- Fields: product barcode, quantity. Submit → `TradeService.receiveStock()`.

### `StorefrontView` (`@Route("store", layout = MainLayout.class)`) – public
- Grid of products with “Add to cart” button.

### `PersistentCartView` (`@Route("cart", layout = MainLayout.class)`)
- Displays draft order, editable quantities, “Checkout” button.

### `CheckoutView` (`@Route("checkout", layout = MainLayout.class)`)
- Order summary, payment method selection, address field, pay button.

### `ReceiptView` (`@Route("receipt/:orderId", layout = MainLayout.class)`)
- Shows receipt HTML (from `DocumentService`). Print button triggers browser print dialog.

## Developer Warning
- Hiding a button is not security. The service layer must always enforce permissions.
- Long‑running tasks (e.g., payment processing) happen on the server; the UI remains responsive because Vaadin handles asynchronous updates.
