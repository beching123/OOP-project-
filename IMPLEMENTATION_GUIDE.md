# IMPLEMENTATION GUIDE: Step-by-Step Instructions

This guide provides detailed, step-by-step instructions to implement each layer of the Madam E-Commerce system.

---

## PART 1: DATABASE SETUP

### Step 1.1: Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce;
\c ecommerce
```

### Step 1.2: Execute Schema Script
```bash
# File: src/main/resources/sql/schema.sql
# This creates:
# - users table (with password_hash, roles, version)
# - products table (with barcode, stock, version)
# - orders table (with status: DRAFT/PENDING_VERIFICATION/PAID)
# - order_items table (line items)
# - app_settings table (key-value config)
# - audit_records table (immutable transaction log)

psql -U postgres -d ecommerce -f src/main/resources/sql/schema.sql
```

### Step 1.3: Load Test Data
```bash
# File: src/main/resources/sql/seed_data.sql
# This inserts:
# - Test users (admin, cashier, customer)
# - Sample products (bread, milk, etc.)
# - Initial app settings

psql -U postgres -d ecommerce -f src/main/resources/sql/seed_data.sql
```

### Step 1.4: Verify Tables
```sql
\dt  -- List all tables
SELECT * FROM users;  -- Should show 3 test users
SELECT * FROM products;  -- Should show sample products
```

---

## PART 2: CONFIGURATION & ENVIRONMENT SETUP

### Step 2.1: Configure Database Connection (application.properties)
```properties
# File: src/main/resources/application.properties

spring.application.name=madam-ecommerce
server.port=8080

# PostgreSQL Connection (PRODUCTION)
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA (if using later)
spring.jpa.hibernate.ddl-auto=validate

# Vaadin
vaadin.productionMode=false

# Security
spring.security.user.name=admin
spring.security.user.password=admin123
```

### Step 2.2: Configure Test Database (application-test.properties)
```properties
# File: src/main/resources/application-test.properties

# H2 In-Memory Database (for unit tests)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (for debugging)
spring.h2.console.enabled=true
```

### Step 2.3: Set Java System Properties
```bash
# File: .env (or set in IDE)
JAVA_HOME=C:\Program Files\Java\jdk-17  # Windows
JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # Linux
```

---

## PART 3: IMPLEMENT REPOSITORY LAYER

### Step 3.1: Implement UserRepo

**File**: `src/main/java/com/company/ecommerce/persistence/UserRepo.java`

```java
package com.company.ecommerce.persistence;

import com.company.ecommerce.model.User;
import java.util.Optional;

/**
 * UserRepo — Data access for user records.
 * 
 * Responsibilities:
 * - Find users by username (for authentication)
 * - Find users by ID (for profile lookups)
 * - Save and update user records
 * 
 * Rationale for interface:
 * - Services depend on the interface, not the SQL implementation
 * - Easy to mock in tests
 * - Could have multiple implementations (DB, LDAP, OAuth, etc.)
 */
public interface UserRepo {
    
    /**
     * Find a user by their unique username.
     * 
     * WHY: Login flow uses username as the key, not ID.
     * In retail systems, usernames are often staff IDs or email.
     * 
     * Implementation:
     * 1. Execute SQL: SELECT * FROM users WHERE username = ?
     * 2. Map ResultSet to User object
     * 3. Return Optional.empty() if not found (no null pointer exceptions)
     * 
     * @param username the username to search for
     * @return Optional containing User if found, empty otherwise
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find a user by their primary key.
     * 
     * WHY: Sessions store user ID, not username. Quick lookup by PK.
     * 
     * Implementation:
     * 1. Execute SQL: SELECT * FROM users WHERE id = ?
     * 2. Map ResultSet to User object (determine type: Admin/Customer/Cashier via roles)
     * 3. Return Optional.empty() if not found
     * 
     * @param id the user ID
     * @return Optional containing User if found
     */
    Optional<User> findById(Long id);
    
    /**
     * Save a new user record.
     * 
     * WHY: Admin creates new staff accounts or customers register.
     * 
     * Implementation:
     * 1. Validate username not already taken: SELECT COUNT(*) FROM users WHERE username = ?
     * 2. Hash password using BCrypt (never store plaintext)
     * 3. Execute SQL: INSERT INTO users (username, password_hash, roles, version) VALUES (?, ?, ?, 1)
     * 4. Retrieve generated ID using RETURNING id
     * 5. Return saved User object with populated ID
     * 
     * @param user the user to save (ID must be null for new user)
     * @return the saved user with populated ID
     * @throws RuntimeException if username already exists
     */
    User save(User user);
    
    /**
     * Update an existing user record.
     * 
     * WHY: Admin edits user permissions or password.
     * 
     * Implementation (OPTIMISTIC LOCKING):
     * 1. Execute SQL: UPDATE users SET roles = ?, version = version + 1 
     *                WHERE id = ? AND version = old_version
     * 2. If no rows updated (version changed), throw StaleDataException
     * 3. Increment user.version locally to match DB
     * 4. Return updated User object
     * 
     * WHY version check: Prevents race conditions.
     * If another admin changed the same user's permissions meanwhile, error out.
     * 
     * @param user the user to update (ID and version must be set)
     * @return the updated user
     * @throws StaleDataException if version mismatch (another transaction updated user)
     */
    User update(User user);
}
```

### Step 3.2: Implement UserRepoImpl

**File**: `src/main/java/com/company/ecommerce/persistence/impl/UserRepoImpl.java`

```java
package com.company.ecommerce.persistence.impl;

import org.springframework.stereotype.Repository;
import com.company.ecommerce.persistence.UserRepo;
import com.company.ecommerce.model.User;
import com.company.ecommerce.app.DbConnection;
import java.sql.*;
import java.util.Optional;

/**
 * UserRepoImpl — Raw JDBC implementation of UserRepo.
 * 
 * WHY Raw JDBC (not JPA/Hibernate):
 * - Full control over SQL: we can tune queries for POS terminal performance
 * - Explicit: developers see exactly what SQL runs (no hidden N+1 queries)
 * - Easier to debug: stack traces point to actual SQL, not proxy layers
 * - Simpler transaction control: we manage connections explicitly
 * 
 * Architecture:
 * 1. DbConnection provides thread-local Connection from pool
 * 2. Execute SQL with parameters (prevents SQL injection)
 * 3. Map ResultSet to Java objects
 * 4. Handle exceptions (SQLState codes for specific errors)
 */
@Repository
public class UserRepoImpl implements UserRepo {
    
    private final DbConnection dbConnection;
    
    public UserRepoImpl(DbConnection dbConnection) {
        this.dbConnection = dbConnection;
    }
    
    @Override
    public Optional<User> findByUsername(String username) {
        // STEP 1: Get connection from thread-local pool
        Connection conn = dbConnection.getConnection();
        
        // STEP 2: Prepare parameterized SQL (prevents SQL injection)
        String sql = "SELECT id, username, password_hash, roles, permissions, employee_number, version FROM users WHERE username = ?";
        
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);  // Bind parameter safely
            
            // STEP 3: Execute and map ResultSet
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = mapResultSetToUser(rs);
                    return Optional.of(user);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Database error finding user by username", e);
        }
        
        return Optional.empty();
    }
    
    @Override
    public Optional<User> findById(Long id) {
        Connection conn = dbConnection.getConnection();
        String sql = "SELECT id, username, password_hash, roles, permissions, employee_number, version FROM users WHERE id = ?";
        
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = mapResultSetToUser(rs);
                    return Optional.of(user);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Database error finding user by ID", e);
        }
        
        return Optional.empty();
    }
    
    @Override
    public User save(User user) {
        Connection conn = dbConnection.getConnection();
        
        // STEP 1: Check for duplicate username
        String checkSql = "SELECT COUNT(*) FROM users WHERE username = ?";
        try (PreparedStatement stmt = conn.prepareStatement(checkSql)) {
            stmt.setString(1, user.getUsername());
            try (ResultSet rs = stmt.executeQuery()) {
                rs.next();
                if (rs.getInt(1) > 0) {
                    throw new RuntimeException("Username already exists: " + user.getUsername());
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error checking duplicate username", e);
        }
        
        // STEP 2: Hash password with BCrypt (cost factor 10 = ~100ms per hash)
        String passwordHash = BCrypt.hashpw(user.getPasswordHash(), BCrypt.gensalt(10));
        
        // STEP 3: Insert new user
        String insertSql = "INSERT INTO users (username, password_hash, roles, permissions, employee_number, version) " +
                          "VALUES (?, ?, ?, ?, ?, 1) RETURNING id";
        
        try (PreparedStatement stmt = conn.prepareStatement(insertSql)) {
            stmt.setString(1, user.getUsername());
            stmt.setString(2, passwordHash);
            stmt.setString(3, String.join(",", user.getRoles()));  // Convert List to CSV
            stmt.setString(4, String.join(",", user.getPermissions()));
            stmt.setString(5, user.getEmployeeNumber() != null ? user.getEmployeeNumber() : null);
            
            try (ResultSet rs = stmt.executeQuery()) {
                rs.next();
                Long generatedId = rs.getLong("id");
                user.setId(generatedId);
                user.setVersion(1);
                return user;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving user", e);
        }
    }
    
    @Override
    public User update(User user) {
        Connection conn = dbConnection.getConnection();
        
        // STEP 1: Update with optimistic locking (version check)
        String updateSql = "UPDATE users SET roles = ?, permissions = ?, version = version + 1 " +
                          "WHERE id = ? AND version = ? RETURNING version";
        
        try (PreparedStatement stmt = conn.prepareStatement(updateSql)) {
            stmt.setString(1, String.join(",", user.getRoles()));
            stmt.setString(2, String.join(",", user.getPermissions()));
            stmt.setLong(3, user.getId());
            stmt.setInt(4, user.getVersion());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    // SUCCESS: Version incremented in DB
                    int newVersion = rs.getInt("version");
                    user.setVersion(newVersion);
                    return user;
                } else {
                    // FAILURE: No rows updated = version mismatch = another transaction changed this user
                    throw new StaleDataException("User was modified by another transaction; current version: " + user.getVersion());
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error updating user", e);
        }
    }
    
    /**
     * Helper: Map SQL ResultSet row to User object.
     * 
     * WHY a helper method:
     * - Reusable logic across multiple query methods
     * - Type conversion centralized (String → List, ResultSet → User)
     * - Easier to maintain if User structure changes
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        Long id = rs.getLong("id");
        String username = rs.getString("username");
        String passwordHash = rs.getString("password_hash");
        String rolesStr = rs.getString("roles");
        String permissionsStr = rs.getString("permissions");
        String employeeNumber = rs.getString("employee_number");
        int version = rs.getInt("version");
        
        // Convert CSV strings back to Lists
        List<String> roles = Arrays.asList(rolesStr != null ? rolesStr.split(",") : new String[0]);
        List<String> permissions = Arrays.asList(permissionsStr != null ? permissionsStr.split(",") : new String[0]);
        
        // Determine concrete subclass based on roles
        User user;
        if (roles.contains("ADMIN")) {
            user = new Admin(id, username, passwordHash, roles, permissions);
        } else if (roles.contains("CASHIER")) {
            user = new Cashier(id, username, passwordHash, roles, permissions, employeeNumber);
        } else if (roles.contains("CUSTOMER")) {
            user = new Customer(id, username, passwordHash, roles, permissions);
        } else {
            throw new RuntimeException("Unknown user type with roles: " + roles);
        }
        
        user.setVersion(version);
        return user;
    }
}
```

### Step 3.3: Implement Other Repositories (Similar Pattern)

Follow the same pattern for:
- **ProductRepo** → `ProductRepoImpl`
  - Find by ID: `SELECT * FROM products WHERE id = ?`
  - Find by barcode: `SELECT * FROM products WHERE barcode = ?` (indexed for speed)
  - Find all: `SELECT * FROM products ORDER BY name`
  - Update stock with version check: `UPDATE products SET stock = stock - ?, version = version + 1 WHERE id = ? AND version = ?`

- **OrderRepo** → `OrderRepoImpl`
  - Save new order: `INSERT INTO orders (customer_id, cashier_id, status, total, tax, created_at, version) VALUES (...)`
  - Find by status: `SELECT * FROM orders WHERE status = ?` (for manager dashboards)
  - Update order status: `UPDATE orders SET status = ?, version = version + 1 WHERE id = ? AND version = ?`
  - Find with order_items: `SELECT o.*, i.* FROM orders o LEFT JOIN order_items i ON o.id = i.order_id WHERE o.id = ?`

- **AuditRepo** → `AuditRepoImpl` (Write-only, no updates)
  - Insert audit record: `INSERT INTO audit_records (timestamp, user_id, user_username, action, details, order_id) VALUES (...)`
  - Find recent: `SELECT * FROM audit_records ORDER BY timestamp DESC LIMIT ?`
  - Find with filter: `SELECT * FROM audit_records WHERE timestamp >= ? AND timestamp <= ? AND user_id = ? AND action = ?`

---

## PART 4: IMPLEMENT SERVICE LAYER

### Step 4.1: Implement IdentityService

**File**: `src/main/java/com/company/ecommerce/service/impl/IdentityServiceImpl.java`

```java
/**
 * IdentityServiceImpl — Authentication and user session management.
 * 
 * Responsibilities:
 * 1. Login validation (username + password)
 * 2. Password hashing (BCrypt)
 * 3. Permission checks (e.g., "Can this user create orders?")
 * 4. Session token management
 * 
 * WHY this layer exists:
 * - Views don't directly access UserRepo (bad separation)
 * - Business rules (e.g., BCrypt cost factor, login retry limits) centralized here
 * - Easy to add 2FA, OAuth, LDAP later without changing views
 */
@Service
public class IdentityServiceImpl implements IdentityService {
    
    @Inject private UserRepo userRepo;
    @Inject private SessionManager sessionManager;
    @Inject private AuditService auditService;
    
    @Override
    public User authenticate(String username, String password) {
        // STEP 1: Find user by username
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("Invalid credentials"));
        
        // STEP 2: Compare password using BCrypt
        // WHY BCrypt.checkpw (not plain ==):
        // - BCrypt includes salt in the hash
        // - Slow (intentionally) to resist brute force
        // - Comparison is time-constant (prevents timing attacks)
        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            auditService.record("LOGIN_FAILED", username, "invalid_password");
            throw new AccessDeniedException("Invalid credentials");
        }
        
        // STEP 3: Store user in session
        sessionManager.setCurrentUser(user);
        
        // STEP 4: Audit successful login
        auditService.record("LOGIN_SUCCESS", username, "");
        
        return user;
    }
    
    @Override
    public boolean hasPermission(String permissionCode) {
        User current = sessionManager.getCurrentUser();
        if (current == null) return false;  // Not logged in
        return current.getPermissions().contains(permissionCode);
    }
    
    @Override
    public void requirePermission(String permissionCode) {
        if (!hasPermission(permissionCode)) {
            throw new AccessDeniedException("Permission denied: " + permissionCode);
        }
    }
}
```

### Step 4.2: Implement TradeService (Checkout Orchestration)

**File**: `src/main/java/com/company/ecommerce/service/impl/TradeServiceImpl.java`

```java
/**
 * TradeServiceImpl — Order checkout orchestration.
 * 
 * This is the most critical service: it coordinates:
 * 1. Permission checking (only cashier can checkout)
 * 2. Stock validation (enough items available)
 * 3. Payment processing (charge payment method)
 * 4. Database updates (status, stock)
 * 5. Audit logging (record transaction)
 * 6. Notifications (receipt email)
 * 
 * WHY a single service orchestrates all these:
 * - Ensures all-or-nothing semantics (ACID)
 * - If payment fails, stock not decremented
 * - If stock check fails, payment not processed
 * - Single transaction boundary simplifies debugging
 * 
 * WHY IdentityService.requirePermission() is called:
 * - Only authorized staff can process checkouts
 * - Audit trail shows who processed each checkout
 */
@Service
public class TradeServiceImpl implements TradeService {
    
    @Inject private OrderRepo orderRepo;
    @Inject private ProductRepo productRepo;
    @Inject private PaymentGateway paymentGateway;
    @Inject private AuditService auditService;
    @Inject private NotificationService notificationService;
    @Inject private TransactionManager transactionManager;
    @Inject private IdentityService identityService;
    
    @Override
    public Order checkout(Long orderId, PaymentMethod paymentMethod) throws PaymentException {
        // STEP 0: Permission check
        identityService.requirePermission("order.checkout");
        
        try {
            // STEP 1: Begin transaction
            // WHY: If anything fails below, all changes roll back (no partial checkout)
            transactionManager.begin();
            
            // STEP 2: Fetch order
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            
            if (!order.getStatus().equals(Order.STATUS_DRAFT)) {
                throw new RuntimeException("Order not in DRAFT status; cannot checkout");
            }
            
            // STEP 3: Validate stock for each item
            // WHY loop: check all items BEFORE charging payment
            // If any item out of stock, error out before payment
            for (OrderItem item : order.getItems()) {
                Product product = productRepo.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
                
                if (product.getStock() < item.getQuantity()) {
                    throw new InsufficientStockException(
                        "Not enough stock for " + product.getName() + 
                        "; requested: " + item.getQuantity() + ", available: " + product.getStock()
                    );
                }
            }
            
            // STEP 4: Charge payment
            // WHY before stock update: if payment fails, don't update DB
            PaymentResult paymentResult = paymentGateway.charge(order, paymentMethod);
            
            if (!paymentResult.isSuccessful()) {
                throw new PaymentException("Payment failed: " + paymentResult.getErrorMessage());
            }
            
            // STEP 5: Decrement stock atomically (with version check)
            // WHY version check: if another cashier reduced stock meanwhile, detect conflict
            for (OrderItem item : order.getItems()) {
                Product product = productRepo.findById(item.getProductId()).get();
                product.setStock(product.getStock() - item.getQuantity());
                
                try {
                    productRepo.update(product);
                } catch (StaleDataException e) {
                    // Another transaction modified this product; rollback and notify user
                    transactionManager.rollback();
                    throw new RuntimeException("Stock changed during checkout; please retry", e);
                }
            }
            
            // STEP 6: Update order status
            order.setStatus(Order.STATUS_PAID);
            orderRepo.update(order);
            
            // STEP 7: Commit transaction
            // Now all changes are permanent
            transactionManager.commit();
            
            // STEP 8: Post-transaction actions (don't rollback if these fail)
            // Rationale: order already saved; if email fails, don't roll back checkout
            auditService.record("CHECKOUT_SUCCESS", order.getId(), 
                "amount=" + order.getTotal() + ",payment_method=" + paymentMethod.getClass().getSimpleName());
            notificationService.sendReceiptEmail(order);
            
            return order;
            
        } catch (Exception e) {
            transactionManager.rollback();
            throw e;
        }
    }
}
```

### Step 4.3: Implement CatalogService

**File**: `src/main/java/com/company/ecommerce/service/impl/DefaultCatalogService.java` (expand from skeleton)

```java
/**
 * Responsibilities:
 * - Look up products by barcode (POS terminal scanning)
 * - List all products (storefront display)
 * - Update prices (admin function)
 * 
 * WHY separate service:
 * - Catalog operations different from order operations
 * - Easy to cache product list for performance
 * - Could be replaced with external API (e.g., ERP system)
 */
@Service
public class DefaultCatalogService implements CatalogService {
    
    @Inject private ProductRepo productRepo;
    @Inject private IdentityService identityService;
    
    @Override
    public Product lookupByBarcode(String barcode) {
        // STEP 1: Query product by barcode (fast: barcode is indexed)
        return productRepo.findByBarcode(barcode)
                .orElseThrow(() -> new RuntimeException("Product not found: " + barcode));
    }
    
    @Override
    public List<Product> getAllProducts() {
        // STEP 1: Fetch all products
        // STEP 2: Optional: cache for 5 minutes (refresh before storefront render)
        return productRepo.findAll();
    }
    
    @Override
    public void updatePrice(long productId, BigDecimal newPrice, User admin) {
        // STEP 1: Permission check (only admins can update prices)
        if (!admin.getRoles().contains("ADMIN")) {
            throw new AccessDeniedException("Only admins can update prices");
        }
        
        // STEP 2: Validate price (must be positive)
        if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Price must be positive");
        }
        
        // STEP 3: Fetch product
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // STEP 4: Update price (version field prevents concurrent updates)
        product.setPrice(newPrice);
        productRepo.update(product);
    }
}
```

---

## PART 5: IMPLEMENT UI LAYER

### Step 5.1: Implement LoginView

**File**: `src/main/java/com/company/ecommerce/ui/views/LoginView.java` (expand from skeleton)

```java
/**
 * LoginView — Authentication screen.
 * 
 * Responsibilities:
 * 1. Display username + password form
 * 2. Validate input (non-empty)
 * 3. Call IdentityService.authenticate()
 * 4. On success: redirect to dashboard
 * 5. On failure: show error message
 * 
 * WHY Vaadin server-side rendering:
 * - No separate REST API to build
 * - Direct access to Spring beans (@Inject IdentityService)
 * - Server controls security (tokens never leak to client)
 */
@Route(value = "login", layout = MainLayout.class)
public class LoginView extends VerticalLayout {
    
    private final IdentityService identityService;
    private final SessionManager sessionManager;
    private final TextField usernameField;
    private final PasswordField passwordField;
    private final Button loginButton;
    private final Label errorLabel;
    
    public LoginView(@Inject IdentityService identityService, 
                     @Inject SessionManager sessionManager) {
        this.identityService = identityService;
        this.sessionManager = sessionManager;
        
        // STEP 1: Create form fields
        usernameField = new TextField("Username");
        usernameField.setWidth("100%");
        usernameField.setPlaceholder("Enter staff ID or email");
        
        passwordField = new PasswordField("Password");
        passwordField.setWidth("100%");
        
        // STEP 2: Create login button
        loginButton = new Button("Login", e -> handleLogin());
        
        // STEP 3: Error label (hidden by default)
        errorLabel = new Label();
        errorLabel.getStyle().set("color", "red");
        errorLabel.setVisible(false);
        
        // STEP 4: Layout
        add(
            new H1("Madam E-Commerce"),
            usernameField,
            passwordField,
            loginButton,
            errorLabel
        );
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
    }
    
    private void handleLogin() {
        try {
            // STEP 1: Validate input
            if (usernameField.getValue().isEmpty() || passwordField.getValue().isEmpty()) {
                showError("Username and password required");
                return;
            }
            
            // STEP 2: Call service (may throw AccessDeniedException)
            User user = identityService.authenticate(
                usernameField.getValue(), 
                passwordField.getValue()
            );
            
            // STEP 3: On success, redirect to dashboard
            // WHY different routes for different user types:
            // - Admin sees system settings
            // - Cashier sees POS terminal
            // - Customer sees storefront
            String dashboardRoute = user.getType().equals("ADMIN") ? "admin-dashboard" 
                                   : user.getType().equals("CASHIER") ? "pos-terminal"
                                   : "storefront";
            
            getUI().ifPresent(ui -> ui.navigate(dashboardRoute));
            
        } catch (AccessDeniedException e) {
            showError("Invalid username or password");
            passwordField.setValue("");  // Clear password field
        }
    }
    
    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.setVisible(true);
    }
}
```

### Step 5.2: Implement PosTerminalView (Cashier)

**File**: `src/main/java/com/company/ecommerce/ui/views/staff/PosTerminalView.java` (expand from skeleton)

```java
/**
 * PosTerminalView — Point-of-sale terminal for cashiers.
 * 
 * Responsibilities:
 * 1. Display cart (items, quantities, total)
 * 2. Accept barcode input from scanner
 * 3. Look up product via CatalogService
 * 4. Add item to cart
 * 5. Allow quantity adjustment
 * 6. Allow item removal
 * 7. Trigger checkout (charge payment)
 * 
 * WHY separate from StorefrontView:
 * - Cashier workflow different from customer self-checkout
 * - Barcode scanning focus (not mouse clicks)
 * - Permission checks (only CASHIER role)
 */
@Route(value = "pos-terminal", layout = MainLayout.class)
public class PosTerminalView extends VerticalLayout {
    
    private final CatalogService catalogService;
    private final TradeService tradeService;
    private final IdentityService identityService;
    private final BarcodeInputListener barcodeListener;
    
    private Order currentOrder;  // In-memory shopping cart
    private Grid<OrderItem> itemGrid;
    private Label totalLabel;
    
    public PosTerminalView(@Inject CatalogService catalogService,
                          @Inject TradeService tradeService,
                          @Inject IdentityService identityService,
                          @Inject BarcodeInputListener barcodeListener) {
        
        this.catalogService = catalogService;
        this.tradeService = tradeService;
        this.identityService = identityService;
        this.barcodeListener = barcodeListener;
        
        // STEP 1: Permission check
        identityService.requirePermission("order.checkout");
        
        // STEP 2: Initialize empty cart
        currentOrder = new Order();
        currentOrder.setItems(new ArrayList<>());
        currentOrder.setTotal(BigDecimal.ZERO);
        currentOrder.setStatus(Order.STATUS_DRAFT);
        
        // STEP 3: Setup grid to display cart items
        itemGrid = new Grid<>(OrderItem.class, false);
        itemGrid.addColumn(OrderItem::getProductName).setHeader("Product");
        itemGrid.addColumn(OrderItem::getQuantity).setHeader("Qty");
        itemGrid.addColumn(OrderItem::getUnitPrice).setHeader("Unit Price");
        itemGrid.addColumn(item -> item.getQuantity().multiply(item.getUnitPrice())).setHeader("Total");
        
        // STEP 4: Setup barcode input listener
        barcodeListener.onBarcodeScanned(barcode -> handleBarcodeScanned(barcode));
        
        // STEP 5: Setup checkout button
        Button checkoutButton = new Button("Checkout", e -> handleCheckout());
        
        // STEP 6: Total label
        totalLabel = new Label("Total: 0 FCFA");
        
        // STEP 7: Layout
        add(
            new H2("POS Terminal"),
            new TextField().withPlaceholder("Scanner input appears here (auto-focus)"),
            itemGrid,
            totalLabel,
            checkoutButton
        );
    }
    
    private void handleBarcodeScanned(String barcode) {
        try {
            // STEP 1: Look up product
            Product product = catalogService.lookupByBarcode(barcode);
            
            // STEP 2: Check if already in cart
            OrderItem existingItem = currentOrder.getItems().stream()
                .filter(item -> item.getProductId().equals(product.getId()))
                .findFirst()
                .orElse(null);
            
            if (existingItem != null) {
                // STEP 3a: Increment quantity if already present
                existingItem.setQuantity(existingItem.getQuantity() + 1);
            } else {
                // STEP 3b: Add new item to cart
                OrderItem newItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    1,  // quantity
                    product.getPrice()
                );
                currentOrder.getItems().add(newItem);
            }
            
            // STEP 4: Update total and grid
            updateTotal();
            itemGrid.setItems(currentOrder.getItems());
            
        } catch (RuntimeException e) {
            Notification.show("Product not found: " + barcode, 3000, Notification.Position.MIDDLE);
        }
    }
    
    private void handleCheckout() {
        try {
            // STEP 1: Save order to DB (status=DRAFT)
            // [Implementation: call OrderRepo.save()]
            
            // STEP 2: Call TradeService.checkout()
            // This validates stock, charges payment, updates order status
            Order finalOrder = tradeService.checkout(
                currentOrder.getId(),
                new CashPayment()  // Or selected payment method
            );
            
            // STEP 3: Show receipt and reset cart
            Notification.show("Checkout successful! Order ID: " + finalOrder.getId());
            currentOrder = new Order();
            currentOrder.setItems(new ArrayList<>());
            updateTotal();
            itemGrid.setItems(currentOrder.getItems());
            
        } catch (InsufficientStockException e) {
            Notification.show("Not enough stock: " + e.getMessage(), 5000, Notification.Position.MIDDLE);
        } catch (PaymentException e) {
            Notification.show("Payment failed: " + e.getMessage(), 5000, Notification.Position.MIDDLE);
        }
    }
    
    private void updateTotal() {
        BigDecimal total = currentOrder.getItems().stream()
            .map(item -> item.getQuantity().multiply(item.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        currentOrder.setTotal(total);
        totalLabel.setText("Total: " + total + " FCFA");
    }
}
```

---

## PART 6: TESTING STRATEGY

### Unit Test Example: IdentityService

```java
@SpringBootTest
class IdentityServiceTest {
    
    @MockBean private UserRepo userRepo;
    @MockBean private SessionManager sessionManager;
    @MockBean private AuditService auditService;
    @Autowired private IdentityService identityService;
    
    @Test
    void testAuthenticateWithValidCredentials() {
        // ARRANGE
        User testUser = new Customer(1L, "customer1", 
            BCrypt.hashpw("password123", BCrypt.gensalt(10)), 
            Arrays.asList("CUSTOMER"), Arrays.asList("order.read"));
        
        when(userRepo.findByUsername("customer1")).thenReturn(Optional.of(testUser));
        
        // ACT
        User result = identityService.authenticate("customer1", "password123");
        
        // ASSERT
        assertEquals("customer1", result.getUsername());
        verify(sessionManager).setCurrentUser(testUser);
    }
    
    @Test
    void testAuthenticateWithInvalidPassword() {
        // ARRANGE
        User testUser = new Customer(1L, "customer1", 
            BCrypt.hashpw("password123", BCrypt.gensalt(10)), 
            Arrays.asList("CUSTOMER"), Arrays.asList("order.read"));
        
        when(userRepo.findByUsername("customer1")).thenReturn(Optional.of(testUser));
        
        // ACT & ASSERT
        assertThrows(AccessDeniedException.class, () -> {
            identityService.authenticate("customer1", "wrongpassword");
        });
    }
}
```

### Integration Test: Checkout with Optimistic Locking

```java
@SpringBootTest
@ActiveProfiles("test")  // Uses application-test.properties (H2 in-memory)
class TradeServiceIntegrationTest {
    
    @Autowired private TradeService tradeService;
    @Autowired private OrderRepo orderRepo;
    @Autowired private ProductRepo productRepo;
    @Autowired private TransactionManager transactionManager;
    
    @Test
    void testCheckoutWithStaleDataException() throws Exception {
        // ARRANGE
        Product product = new Product(null, "1001", "Bread", BigDecimal.valueOf(2.50), 10, 1);
        Product savedProduct = productRepo.save(product);
        
        Order order = new Order();
        order.setItems(Arrays.asList(new OrderItem(savedProduct.getId(), "Bread", 5, BigDecimal.valueOf(2.50))));
        Order savedOrder = orderRepo.save(order);
        
        // ACT: Simulate concurrent modification
        Product productV1 = productRepo.findById(savedProduct.getId()).get();
        productV1.setStock(3);  // Another cashier reduced stock
        productRepo.update(productV1);  // Version incremented to 2
        
        // Now original product still has version=1, but DB has version=2
        // ACT & ASSERT: Checkout should fail with StaleDataException
        assertThrows(StaleDataException.class, () -> {
            tradeService.checkout(savedOrder.getId(), new CashPayment());
        });
    }
}
```

---

## PART 7: BUILD & DEPLOYMENT

### Build with Maven
```bash
mvn clean package
```
This creates `target/madam-ecommerce-1.0.0.jar`

### Run Locally
```bash
java -jar target/madam-ecommerce-1.0.0.jar --spring.profiles.active=dev
```

### Run with Docker
```dockerfile
FROM openjdk:17
COPY target/madam-ecommerce-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t madam-ecommerce .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=password \
  madam-ecommerce
```

### Access Application
```
http://localhost:8080/login
```

Test users (from seed_data.sql):
- Admin: username=`admin`, password=`admin123`
- Cashier: username=`cashier1`, password=`cash123`
- Customer: username=`customer1`, password=`cust123`

---

## CHECKLIST: Implementation Completion

- [ ] Database created and schema loaded
- [ ] application.properties configured with DB credentials
- [ ] UserRepo + UserRepoImpl implemented
- [ ] ProductRepo + ProductRepoImpl implemented
- [ ] OrderRepo + OrderRepoImpl implemented
- [ ] IdentityService implemented
- [ ] TradeService implemented
- [ ] CatalogService implemented
- [ ] LoginView implemented
- [ ] PosTerminalView implemented
- [ ] StorefrontView implemented
- [ ] CheckoutView implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Application runs: `mvn spring-boot:run`
- [ ] Login with test user successful
- [ ] Checkout flow end-to-end tested
- [ ] Audit records recorded in database

---

**Next Steps**: Refer to ARCHITECTURE_DETAILED.md for deeper understanding of design rationale. Consult individual file comments for implementation details.
