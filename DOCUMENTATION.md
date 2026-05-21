# Madam E-Commerce Project Documentation

## 1. Project Overview
Madam E-Commerce is a Java-based skeleton for a retail point-of-sale and storefront application. It is built with Spring Boot, Vaadin server-side UI, raw JDBC, PostgreSQL for production, and H2 for tests. The project provides a strict layered architecture with separation between UI, service, persistence, integration, and app infrastructure.

## 2. Technology Stack
- Java 17
- Spring Boot 3.2
- Vaadin 24
- Spring Security
- Spring Boot Actuator
- JDBC API
- PostgreSQL
- H2 database for tests
- Maven for build and dependency management

## 3. Architecture
The application follows a layered architecture:
- `ui` — Vaadin views render the interface and delegate to services.
- `service` — gatekeeper layer with business workflows, permissions, transactions, and audit hooks.
- `persistence` — repository interfaces for raw SQL and optimistic locking.
- `integration` — external adapter interfaces for payment, email, printing, and barcode handling.
- `app` — foundational infrastructure for connections, transactions, sessions, themes, and error handling.
- `model` — data carrier classes and exceptions.

## 4. Package Contents
- `com.company.ecommerce.app` — application infrastructure classes: `DbConnection`, `TransactionManager`, `SessionManager`, `BackgroundWorker`, `GlobalExceptionHandler`, `AppTheme`, `WebSecurityConfig`, `VaadinConfig`, `WebLauncher`.
- `com.company.ecommerce.model` — data models: `User`, `Customer`, `Employee`, `Admin`, `Cashier`, `Product`, `Order`, `OrderItem`, `PaymentMethod`, `CashPayment`, `MobileMoneyPayment`, `MomoPayment`, `OrangeMoneyPayment`, `BankTransferPayment`, `AppSetting`, `AuditRecord`, and exceptions.
- `com.company.ecommerce.persistence` — repository interfaces: `UserRepo`, `ProductRepo`, `OrderRepo`, `SettingsRepo`, `AuditRepo`.
- `com.company.ecommerce.service` — service interfaces: `IdentityService`, `TradeService`, `CatalogService`, `CartService`, `ConfigService`, `DocumentService`, `AuditService`, `NotificationService`.
- `com.company.ecommerce.service.impl` — placeholder service implementations for config and catalog services.
- `com.company.ecommerce.integration` — external integration interfaces and stub adapters: `PaymentGateway`, `PrinterProvider`, `EmailProvider`, `BarcodeInputListener`, `MomoAdapter`, `OrangeAdapter`, `PrinterProviderImpl`, `EmailProviderImpl`.
- `com.company.ecommerce.ui.views` — Vaadin views and layouts.

## 5. Every Class — Purpose, Fields, Methods
### `WebLauncher`
- Purpose: application entry point
- Methods: `main(String[] args)`

### `DbConnection`
- Purpose: thread-local JDBC connection provider
- Methods: `getConnection()`, `remove()`

### `TransactionManager`
- Purpose: transaction boundary manager with retry support
- Methods: `begin()`, `commit()`, `rollback()`, `executeInTransaction(RunnableWithException task)`

### `SessionManager`
- Purpose: manages Vaadin session user state
- Methods: `getCurrentUser()`, `setCurrentUser(User user)`, `clear()`

### `GlobalExceptionHandler`
- Purpose: handles uncaught Vaadin exceptions and shows user-friendly messages
- Methods: `error(ErrorEvent event)`

### `BackgroundWorker`
- Purpose: executes asynchronous post-transaction tasks
- Methods: `submit(Runnable task)`

### `AppTheme`
- Purpose: reads UI theme settings from config and exposes defaults
- Methods: `getFontSize()`, `isHighContrast()`, `getPrimaryColor()`

### `User`, `Customer`, `Employee`, `Admin`, `Cashier`
- Purpose: user identity hierarchy
- Fields: `id`, `username`, `passwordHash`, `roles`, `permissions`, `employeeNumber` for employees
- Methods: getters/setters, `getType()`, employee role methods

### `Product`
- Purpose: product catalog record
- Fields: `id`, `barcode`, `name`, `price`, `stock`, `version`

### `Order`, `OrderItem`
- Purpose: order and order line data
- Fields: order status, total, tax, customer/cashier IDs, items, createdAt, version
- Constants: order statuses including `PENDING_VERIFICATION`

### Payment model classes
- Purpose: represent payment methods without business logic
- Classes: `PaymentMethod`, `CashPayment`, `MobileMoneyPayment`, `MomoPayment`, `OrangeMoneyPayment`, `BankTransferPayment`

### `AuditRecord`
- Purpose: immutable audit trail entry
- Fields: `id`, `timestamp`, `userId`, `userUsername`, `action`, `details`, `orderId`

### Repository interfaces
- Purpose: define persistence contracts for data access
- Methods: standard find/save/update patterns

### Service interfaces
- Purpose: define service layer APIs for authentication, checkout, catalog, cart, config, document generation, audits, notifications

### Integration interfaces
- Purpose: define external adapter contracts for payments, printing, email, barcode lookup

### Vaadin views
- Purpose: define routes and structure for UI screens
- Examples: `LoginView`, `CheckoutView`, `StorefrontView`, `PosTerminalView`

## 6. User Flow
1. User navigates to `login`
2. `LoginView` collects credentials and calls `IdentityService.authenticate(...)`
3. On success, `SessionManager.setCurrentUser(...)` stores the user
4. Customer visits storefront or cart views
5. Checkout triggers `TradeService.checkout(orderId, paymentMethod, cashier)`
6. Service layer orchestrates persistence and external payment adapters
7. Receipt view displays the completed order

## 7. WhatsApp Payment Flow
1. `CheckoutView` decides on WhatsApp payment
2. It generates a pre-formatted message with order details
3. It URL-encodes that message
4. It opens `https://wa.me/237670315545?text=[ENCODED_MESSAGE]`
5. The implementation is currently a placeholder and must be filled by the payments team

## 8. Database Schema
- `users` — authentication and authorization
- `products` — product catalog with optimistic lock `version`
- `orders` — sales orders with status and `version`
- `order_items` — order line items linked to orders
- `app_settings` — key/value configuration storage
- `audit_records` — immutable audit trail entries

## 9. OOP Principles Demonstrated
- Encapsulation: all fields are private with explicit getters/setters
- Inheritance: abstract `User` and `PaymentMethod` hierarchies
- Polymorphism: concrete payment and employee subclasses override abstract methods
- Abstraction: services depend on interfaces, not implementations
- Immutable value object: `AuditRecord`

## 10. How to Run
1. Install Java 17, Maven, PostgreSQL
2. Create PostgreSQL database `ecommerce`
3. Configure `src/main/resources/application.properties`
4. Run the app with:
   ```bash
   mvn spring-boot:run
   ```
5. Open `http://localhost:8080/login`

## 11. How to Test
- Run all tests with:
  ```bash
  mvn test
  ```
- Use the `test` Spring profile to validate H2 database integration.
- Ensure all new skeleton classes compile before filling logic.
