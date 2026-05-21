# Madam E-Commerce: Detailed Architecture & Design Rationale

## 1. Overview & Design Philosophy

This document explains the **why**, **what**, and **how** behind every architectural decision in the Madam E-Commerce skeleton.

### Design Principles
1. **Strict Layering**: Each layer has a single responsibility and communicates through well-defined interfaces
2. **No Business Logic in Views**: UI only renders and delegates to services
3. **Interface-Based Design**: All major components depend on interfaces, not implementations
4. **Immutable Where Possible**: `AuditRecord` is immutable to prevent accidental tampering
5. **Skeleton Template**: No business logic—only structure and wiring points marked with TODO

---

## 2. Layered Architecture Deep Dive

```
┌─────────────────────────────────────────────────────────────┐
│  UI LAYER (Vaadin Views)                                    │
│  Responsibility: Render screens, collect input              │
│  Example: LoginView, CheckoutView, StorefrontView           │
└─────────────────────────────────────────────────────────────┘
                         ↓ delegates to
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (Business Logic Gatekeeper)                  │
│  Responsibility: Transaction mgmt, auth checks, workflows   │
│  Example: IdentityService, TradeService, CatalogService     │
└─────────────────────────────────────────────────────────────┘
                         ↓ reads/writes via
┌─────────────────────────────────────────────────────────────┐
│  PERSISTENCE LAYER (Repository Pattern)                     │
│  Responsibility: SQL execution, optimistic locking          │
│  Example: UserRepo, OrderRepo, ProductRepo                  │
└─────────────────────────────────────────────────────────────┘
                         ↓ uses
┌─────────────────────────────────────────────────────────────┐
│  DATA MODEL (POJO Carriers)                                 │
│  Responsibility: Data transfer, immutability guarantees     │
│  Example: User, Order, Product, OrderItem                   │
└─────────────────────────────────────────────────────────────┘
                         ↓ external calls
┌─────────────────────────────────────────────────────────────┐
│  INTEGRATION LAYER (External Adapters)                      │
│  Responsibility: Payment, printing, email, barcode lookup   │
│  Example: MomoAdapter, OrangeAdapter, PrinterProvider       │
└─────────────────────────────────────────────────────────────┘
                         ↓ uses
┌─────────────────────────────────────────────────────────────┐
│  APP INFRASTRUCTURE (Framework Glue)                         │
│  Responsibility: Connections, transactions, sessions        │
│  Example: DbConnection, TransactionManager, SessionManager  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Package Structure & Why

### `com.company.ecommerce.model`
**Purpose**: Data transfer and type contracts.
**Why This Design**:
- Immutable records prevent accidental data mutations
- POJOs are serializable and testable
- Clear domain modeling: `User → Employee/Customer`, `Order → OrderItem`, `PaymentMethod → subclasses`

**Files**:
- `User.java`: Abstract base for all authenticated system actors. Concrete subclasses: `Admin`, `Employee`, `Cashier`, `Customer`. Rationale: shared auth fields + role-specific behavior via abstract methods.
- `Product.java`: Catalog item with optimistic lock `version` field. Why: prevent lost updates in concurrent scenarios.
- `Order.java` + `OrderItem.java`: Order line representation. Rationale: supports multi-item orders with per-item pricing.
- `PaymentMethod.java`: Abstract base for payment types. Subclasses: `CashPayment`, `MobileMoneyPayment` (MTN/Orange), `BankTransferPayment`. Rationale: extensible payment handling without runtime type casting.
- Exceptions: `StaleDataException`, `PaymentException`, `AccessDeniedException`, `InsufficientStockException`. Why: typed exceptions enable precise error handling.

### `com.company.ecommerce.persistence`
**Purpose**: Raw SQL execution with optimistic locking and transaction boundaries.
**Why Raw JDBC (Not ORM)**:
- Full control over SQL generation for performance tuning
- Explicit transaction demarcation aids debugging
- No magic; developers see exactly what's happening in the database
- Easier to audit for compliance (e.g., audit records)

**Files**:
- `UserRepo`: Find by username (for login). Why: username is the auth key, not ID.
- `ProductRepo`: Find by barcode (POS terminal scanning). Rationale: barcode is how products are looked up in retail.
- `OrderRepo`: Save, update draft, find by status. Why: status-based queries (e.g., "all PENDING_VERIFICATION orders for the manager to review").
- `SettingsRepo`: Key-value configuration storage. Rationale: runtime tuning without code redeploy.
- `AuditRepo`: Write-only audit trail. Why: immutable audit history for compliance and debugging.

**Optimistic Locking Contract**: Every mutable record has a `version` field. On update, SQL checks `WHERE version = old_version`. If another transaction modified the record, the WHERE clause fails and throws `StaleDataException`. Service layer retries or alerts user.

### `com.company.ecommerce.service`
**Purpose**: Orchestration layer enforcing business rules, permissions, and transactions.
**Why Interfaces, Not Implementations**:
- Services depend on contracts, not concrete code
- Easy to mock for testing
- Multiple implementations possible (e.g., `CatalogService` could be local DB or external API)

**Files**:
- `IdentityService`: Login/authentication. Rationale: isolates password hashing, 2FA, and session token generation from UI.
- `TradeService`: Checkout orchestration. Why: coordinates permission checks, stock validation, payment processing, audit logging in a single transaction.
- `CatalogService`: Product lookup and price updates. Why: separates product operations from order operations for single-responsibility.
- `CartService`: Shopping cart state management. Rationale: temporary cart storage (in-memory or session-scoped).
- `ConfigService`: Settings retrieval. Why: allows runtime feature toggles without redeploying.
- `DocumentService`: Receipt/invoice generation. Rationale: separates document logic from transaction processing.
- `AuditService`: Audit record querying. Why: audit trail locked separately from business operations.
- `NotificationService`: Email/SMS sending. Rationale: async notifications don't block checkout.

### `com.company.ecommerce.app`
**Purpose**: Spring Boot infrastructure and application bootstrap.
**Why These Components**:
- `WebLauncher`: Entry point; Spring Boot main.
- `DbConnection`: Thread-local JDBC connection pool. Why: avoids passing Connection objects through every method; each thread has its own connection context.
- `TransactionManager`: Explicit transaction boundaries (begin/commit/rollback) with retry logic. Rationale: don't rely on Spring's automatic transaction proxying—business logic should control transaction semantics.
- `SessionManager`: Vaadin session user storage. Why: stores logged-in user per HTTP session; scoped to Vaadin's session lifecycle.
- `GlobalExceptionHandler`: Catches uncaught Vaadin exceptions and shows user-friendly messages. Rationale: prevent stack traces from reaching end users.
- `AppTheme`: UI theming (fonts, colors, contrast modes). Why: isolated from component code so design can change without touching Java.
- `WebSecurityConfig`: Spring Security configuration. Rationale: protects endpoints, enforces HTTPS, prevents CSRF.
- `VaadinConfig`: Vaadin-specific Spring beans. Why: initializes error handlers and theme on app startup.

### `com.company.ecommerce.integration`
**Purpose**: External system adapters (payment, printing, email, barcode).
**Why Interface-Based Adapters**:
- Services call `PaymentGateway` interface, not specific adapter
- Easily swap implementations (e.g., test with mock, production with real API)
- New payment methods added by implementing the interface

**Files**:
- `PaymentGateway`: Interface. Implementations: `MomoAdapter`, `OrangeAdapter`. Why: different mobile money providers have different API contracts.
- `PrinterProvider` + `PrinterProviderImpl`: Receipt printing. Rationale: hardware-specific logic (serial port, printer drivers) encapsulated away from business logic.
- `EmailProvider` + `EmailProviderImpl`: Email notifications. Why: SMTP configuration and template rendering isolated.
- `BarcodeInputListener`: Receives barcode scanner input and looks up product via `CatalogService`.

### `com.company.ecommerce.ui.views`
**Purpose**: Vaadin server-side UI components.
**Why Vaadin** (not React/Angular):
- Server-side rendering: no REST API to build
- Java-only: leverage existing Spring beans and services
- Rapid prototyping with server-side logic
- Easier to secure: no client-side authentication tokens to leak

**Key Views**:
- `LoginView`: Username/password form. Delegates to `IdentityService.authenticate()`.
- `StorefrontView`: Product list and cart. Calls `CatalogService.getAllProducts()` and `CartService` methods.
- `CheckoutView`: Payment method selection. Skeleton with TODO methods for WhatsApp payment redirect.
- `PosTerminalView`: Cashier-facing terminal for scanning barcodes and ringing items. Calls `BarcodeInputListener` and `TradeService.checkout()`.
- `AdminDashboardView`: System-wide metrics. Calls `AuditService.findRecent()`.

---

## 4. Data Flow Examples

### Login Flow
```
1. User enters username/password in LoginView
2. LoginView calls IdentityService.authenticate(username, password)
3. IdentityService:
   a. Calls UserRepo.findByUsername(username)
   b. Compares passwordHash (BCrypt)
   c. If match: creates session token, stores in SessionManager, returns User
   d. If mismatch: throws AccessDeniedException
4. LoginView catches success, redirects to StorefrontView
5. StorefrontView calls SessionManager.getCurrentUser() to get logged-in User
```

### Checkout Flow
```
1. CheckoutView.checkout(orderId, paymentMethod)
2. Calls TradeService.checkout(orderId, paymentMethod, cashier)
3. TradeService:
   a. Begins transaction via TransactionManager
   b. Calls OrderRepo.findById(orderId) → gets Order with status DRAFT
   c. Validates customer has permission (via SessionManager.getCurrentUser())
   d. Checks stock for each OrderItem via ProductRepo.findById() + stock check
   e. Calls PaymentGateway.charge(order, paymentMethod) → MomoAdapter/OrangeAdapter
   f. If payment succeeds: updates Order.status = PAID, calls OrderRepo.updateDraft()
   g. Calls AuditService.record(action="CHECKOUT", orderId=123, details="...")
   h. Calls NotificationService.sendReceiptEmail(order)
   i. Commits transaction
4. CheckoutView displays receipt
```

### WhatsApp Payment Flow (Skeleton)
```
1. CheckoutView.generateWhatsAppMessage(order) formats order details as text
2. CheckoutView.redirectToWhatsApp(message) URL-encodes the message
3. Opens https://wa.me/237670315545?text=[ENCODED_MESSAGE]
4. User sends WhatsApp message to business
5. [IMPLEMENT]: Backend poll mechanism or webhook to detect payment confirmation
6. [IMPLEMENT]: Manual order status update by cashier after receiving payment proof
```

---

## 5. Database Schema Rationale

### `users` table
```sql
id BIGINT PRIMARY KEY
username VARCHAR UNIQUE
password_hash VARCHAR
roles VARCHAR (comma-separated: "ADMIN,CASHIER")
permissions VARCHAR (comma-separated: "order.read,order.write")
employee_number VARCHAR (only for employees)
version INT (optimistic lock)
```
**Why This Design**:
- `username` UNIQUE: login key; faster than searching all users
- `roles` and `permissions` as strings: simple retrieval; avoid JOIN overhead
- `employee_number`: track staff by badge number for payroll/scheduling
- `version`: detect concurrent updates (e.g., permission changes while user is logged in)

### `products` table
```sql
id BIGINT PRIMARY KEY
barcode VARCHAR UNIQUE
name VARCHAR
price DECIMAL(10,2)
stock INT
version INT
```
**Why**:
- `barcode` UNIQUE and indexed: POS terminal scans barcode → fast lookup
- `price` DECIMAL: never float for money (prevents rounding errors)
- `version`: if stock decreases while checkout is in progress, detect conflict

### `orders` table
```sql
id BIGINT PRIMARY KEY
customer_id BIGINT FK users
cashier_id BIGINT FK users
status VARCHAR (DRAFT, PENDING_VERIFICATION, PAID, VOID, SHIPPED)
total DECIMAL(10,2)
tax DECIMAL(10,2)
created_at TIMESTAMP
version INT
```
**Why**:
- `customer_id` + `cashier_id`: track who bought what and which staff processed it (audit trail)
- `status` field-based queries: manager queries "SELECT * FROM orders WHERE status='PENDING_VERIFICATION'" to see orders awaiting payment confirmation
- `created_at` TIMESTAMP: compliance logging; ability to query orders by date range
- `version`: prevent race conditions if multiple cashiers try to finalize the same draft

### `order_items` table
```sql
id BIGINT PRIMARY KEY
order_id BIGINT FK orders
product_id BIGINT FK products
product_name VARCHAR (denormalized copy)
quantity INT
unit_price DECIMAL(10,2)
```
**Why Denormalized**:
- `product_name` copied into order_items: historical record. If product name changes later, receipt still shows what customer bought
- No version field: order_items are immutable once order is finalized

### `app_settings` table
```sql
key VARCHAR PRIMARY KEY
value VARCHAR
```
**Why**:
- Simple key-value store for runtime config (e.g., "receipt_footer_text", "max_daily_transactions")
- No need for migrations if you add a new setting; just insert a row

### `audit_records` table
```sql
id BIGINT PRIMARY KEY
timestamp TIMESTAMP
user_id BIGINT FK users
user_username VARCHAR
action VARCHAR (CHECKOUT, LOGIN_FAILED, STOCKTAKE, etc.)
details VARCHAR (JSON or free text)
order_id BIGINT FK orders (nullable)
```
**Why**:
- Immutable audit trail: no UPDATE or DELETE allowed; only INSERT
- `timestamp` + `user_id` + `action`: easily trace who did what when
- `details` field: extensible; store JSON for complex context (e.g., `{"payment_method":"MTN","amount":"50000 FCFA"}`)
- `order_id` nullable: some audit records don't relate to a specific order (e.g., login failures)

---

## 6. OOP Design Patterns Used

### Abstract Class Hierarchy (Inheritance)
```
User (abstract)
├── Admin
├── Employee (abstract)
│   ├── Cashier
│   └── [Future: Manager, Accountant]
└── Customer
```
**Why**: Shared fields (id, username, roles) live in base class. Role-specific methods override in subclasses. Single-responsibility: each class has a clear role.

```
PaymentMethod (abstract)
├── CashPayment
├── MobileMoneyPayment (abstract)
│   ├── MomoPayment (MTN)
│   └── OrangeMoneyPayment
└── BankTransferPayment
```
**Why**: Each payment method has different validation rules and API calls. Abstract base ensures all have `processPayment(Order)` method. Easy to add new payment type by creating subclass.

### Repository Pattern (Data Access)
```java
interface UserRepo {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
}

// Implementation: raw SQL in UserRepoImpl
class UserRepoImpl implements UserRepo {
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        // execute SQL, map to User object
    }
}
```
**Why**: Services call interface, not concrete SQL. Easy to mock for tests. Easy to swap DB implementation.

### Service Layer Pattern (Orchestration)
```java
interface TradeService {
    Order checkout(Long orderId, PaymentMethod payment, User cashier) throws PaymentException;
}

class TradeServiceImpl implements TradeService {
    @Inject private OrderRepo orderRepo;
    @Inject private ProductRepo productRepo;
    @Inject private PaymentGateway paymentGateway;
    @Inject private AuditService auditService;

    public Order checkout(...) {
        // 1. Fetch order
        // 2. Validate permissions
        // 3. Check stock
        // 4. Charge payment
        // 5. Update order status
        // 6. Audit log
        // All in one transaction
    }
}
```
**Why**: Centralizes business rules. Prevents logic scattered across UI. Easy to test business logic independently from UI.

### Adapter Pattern (Integration)
```java
interface PaymentGateway {
    PaymentResult charge(Order order, Map<String, String> params) throws PaymentException;
}

class MomoAdapter implements PaymentGateway {
    // Calls MTN Mobile Money API
}

class OrangeAdapter implements PaymentGateway {
    // Calls Orange Money API
}
```
**Why**: `TradeService` calls `PaymentGateway.charge()` without knowing which provider. Easy to add new provider or swap for mock.

### Immutable Value Object Pattern (AuditRecord)
```java
public final class AuditRecord {
    private final Long id;
    private final LocalDateTime timestamp;
    private final String action;
    // All fields final, no setters
    // Constructor sets all fields
}
```
**Why**: Audit records must never change. Final class + final fields prevent accidental mutations. If audit record is created, it's guaranteed immutable forever.

---

## 7. Transaction & Concurrency Strategy

### Optimistic Locking
**Problem**: Two cashiers load the same order draft, both update stock, second update overwrites first.
**Solution**: Every mutable record has `version` field.
```sql
-- Update fails if version changed
UPDATE products SET stock = stock - 5, version = version + 1 
WHERE id = 42 AND version = 10;
```
If result set is 0 rows (another transaction changed version), throw `StaleDataException`.

**Why This Approach**:
- No pessimistic locks (no table locks that block concurrent users)
- Better throughput for read-heavy POS terminal scenarios
- Simpler retry logic: just retry the entire checkout flow

### Transaction Boundary
```java
public Order checkout(Order order) {
    TransactionManager tm = new TransactionManager();
    try {
        tm.begin();
        // ... all SQL calls here run in same transaction
        tm.commit();
    } catch (StaleDataException e) {
        tm.rollback();
        // Retry or notify user
    }
}
```
**Why**:
- Explicit boundaries make transaction scope visible
- No implicit Spring proxy magic
- Easy to understand exactly what runs in one transaction

---

## 8. Security Considerations

### Password Hashing
```java
// In IdentityService
public User authenticate(String username, String password) {
    User user = userRepo.findByUsername(username);
    if (BCrypt.checkpw(password, user.getPasswordHash())) {
        return user; // Match
    }
    throw new AccessDeniedException("Invalid credentials");
}
```
**Why BCrypt**:
- Slow by design: resistant to brute force
- Auto-includes salt: no rainbow tables
- Version field allows upgrading algorithm later

### Session Management
```java
// SessionManager stores User in Vaadin session
SessionManager.setCurrentUser(user);
// Later views call:
User current = SessionManager.getCurrentUser();
```
**Why**:
- Vaadin session is HTTP-session-scoped
- HttpOnly cookie prevents JavaScript access
- Session invalidates on logout or timeout

### Audit Trail
Every checkout, login, permission change logged immutably.
**Why**:
- Compliance: prove who authorized what transaction
- Debugging: trace sequence of events leading to error
- Fraud detection: identify suspicious patterns

---

## 9. Extension Points & TODO Markers

### WhatsApp Payment (CheckoutView.java)
```java
@SuppressWarnings("unused")
private String generateWhatsAppMessage(Order order) {
    // TODO: Format order details into message
    // TODO: URL-encode and build https://wa.me/237670315545?text=...
    throw new UnsupportedOperationException("TODO: Implement WhatsApp message");
}
```

### Barcode Lookup (BarcodeInputListener.java)
```java
public Product lookupByBarcode(String barcode) {
    // TODO: Call CatalogService.lookupByBarcode(barcode)
    // TODO: Handle product not found
    // TODO: Validate barcode format
    throw new UnsupportedOperationException("TODO: Implement barcode lookup");
}
```

### Stock Validation (TradeService.java)
```java
// TODO: Check each OrderItem.quantity <= Product.stock
// TODO: Throw InsufficientStockException if not enough
// TODO: Decrement stock atomically during checkout
```

---

## 10. How to Implement the System

### Phase 1: Database Setup
1. Create PostgreSQL database `ecommerce`
2. Execute `src/main/resources/sql/schema.sql` to create all tables
3. Execute `src/main/resources/sql/seed_data.sql` to load test data

### Phase 2: Core Business Logic
1. Implement `DefaultCatalogService` (inherit from skeleton)
   - Fill in `lookupByBarcode()`: query ProductRepo
   - Fill in `getAllProducts()`: query ProductRepo
   - Fill in `updatePrice()`: permission check + ProductRepo.updatePrice()

2. Implement repository interfaces
   - `UserRepoImpl`: map SQL SELECT results to User objects
   - `ProductRepoImpl`: product lookups and stock updates
   - `OrderRepoImpl`: order CRUD with optimistic locking
   - `AuditRepoImpl`: insert-only audit records

3. Implement service interfaces
   - `IdentityServiceImpl`: login flow + BCrypt password validation
   - `TradeServiceImpl`: complete checkout orchestration with transaction management
   - `NotificationServiceImpl`: send emails (SMTP)

### Phase 3: Payment Integration
1. Create MomoPaymentProcessor
   - Call MTN Mobile Money API
   - Handle async payment confirmation webhooks
2. Create OrangePaymentProcessor
   - Call Orange Money API
3. Wire into TradeService.checkout()

### Phase 4: UI Implementation
1. Fill in `LoginView`: collect credentials, call IdentityService
2. Fill in `StorefrontView`: list products, manage shopping cart
3. Fill in `CheckoutView`: WhatsApp payment, receipt display
4. Fill in `PosTerminalView`: barcode scanning, item ring-up

### Phase 5: Admin Features
1. Implement `AdminDashboardView`: show stats, recent transactions
2. Implement `AuditLogViewer`: search/filter audit records
3. Implement `SystemSettingsView`: edit configuration

---

## 11. Deployment Considerations

### Configuration
- `application.properties`: production DB connection
- `application-test.properties`: H2 in-memory DB for tests
- `pom.xml`: Maven build; `mvn clean package` creates fat JAR

### Scaling
- Thread-local `DbConnection` scales horizontally
- Stateless services: each server can process any request
- Vaadin session persists in HttpSession: use sticky sessions or Redis for multi-node

### Monitoring
- All audits logged: enable queries on audit_records for monitoring
- GlobalExceptionHandler: log all errors for alerting
- Consider adding APM tool (DataDog, New Relic)

---

## 12. Testing Strategy

### Unit Tests
- Mock repositories
- Test service business logic in isolation
- Example: `TradeServiceTest.testCheckoutWithInsufficientStock()`

### Integration Tests
- Use H2 in-memory DB (configured in application-test.properties)
- Real repository implementations
- Example: `OrderRepoTest.testOptimisticLockingConflict()`

### End-to-End Tests
- Selenium or Testcafe to drive Vaadin UI
- Full login → checkout → receipt flow

---

## Summary Table

| Layer | Purpose | Example Class | Pattern |
|-------|---------|---------------|---------|
| UI | Display & input | LoginView | MVC |
| Service | Orchestration | TradeService | Facade |
| Persistence | Data access | OrderRepo | Repository |
| Model | Data transfer | Order | Value Object |
| Integration | External calls | MomoAdapter | Adapter |
| App | Infrastructure | TransactionManager | Utility |

**Next Steps**: Read IMPLEMENTATION_GUIDE.md for step-by-step implementation instructions.
