# 02 – Foundation Layer: `com.company.ecommerce.app`

## Purpose
Provides the infrastructure every other layer depends on: database connections, transactions, user sessions, background execution, and global error handling.

## Classes & Mandatory Public Signatures

### `WebLauncher`
- `@SpringBootApplication`
- `public static void main(String[] args)` — boots the embedded server.

### `VaadinConfig`
- `@Configuration`
- `@Bean public VaadinServiceInitListener vaadinServiceInitListener(GlobalExceptionHandler errorHandler)`
- `@Bean public AppTheme appTheme(ConfigService configService)`

### `WebSecurityConfig`
- Extends `com.vaadin.flow.spring.security.VaadinWebSecurity`
- Configure HTTP security:
  - `/login` → public
  - `/admin/**` → `hasRole("ADMIN")`
  - `/staff/**` → `hasAnyRole("CASHIER","ADMIN")`
  - `/customer/**` → public
- Set custom login view to `com.company.ecommerce.ui.views.LoginView`

### `DbConnection`
- `public static Connection getConnection() throws SQLException`
- `public static void remove()`
- Internally uses `ThreadLocal<Connection>`; reads credentials from `application.properties`. **This is the only place** `DriverManager.getConnection()` is allowed.

### `TransactionManager`
- `@Component`
- `void begin() throws SQLException` — gets connection, sets auto‑commit `false`.
- `void commit() throws SQLException` — commits, closes, calls `DbConnection.remove()`.
- `void rollback() throws SQLException` — rolls back, closes, calls `DbConnection.remove()`.
- `void executeInTransaction(RunnableWithException task)` — calls `begin()`, runs `task`, retries up to 3 times on `StaleDataException`, then `commit()` or `rollback()`.
- Nested interface `RunnableWithException { void run() throws Exception; }`

### `SessionManager`
- `@Component`
- `User getCurrentUser()` — reads from `VaadinSession`.
- `void setCurrentUser(User user)`
- `void clear()` — closes session.

### `GlobalExceptionHandler`
- Implements `com.vaadin.flow.server.ErrorHandler`, `@Component`
- `void error(ErrorEvent event)`:
  - If `StaleDataException` → show “Data modified by another user. Refresh and try again.”
  - Else → log and show generic “Unexpected error, contact support.”

### `BackgroundWorker`
- `@Component`
- `void submit(Runnable task)` — uses a fixed thread pool of size 4.

### `AppTheme`
- `@Component`
- `String getFontSize()`
- `boolean isHighContrast()`
- `String getPrimaryColor()`
- Stores default constants `DEFAULT_FONT_SIZE`, `DEFAULT_CONTRAST`, `DEFAULT_PRIMARY_COLOR`.
- Loads actual values from `ConfigService` keys `"font_size"`, `"contrast_mode"`, `"primary_color"`.

## Developer Rules
- Never call `System.gc()` or manually manage threads.
- All exceptions in `BackgroundWorker` tasks must be caught and logged; never let a thread die silently.
- `TransactionManager.rollback()` must always be called in a `finally` block when not using `executeInTransaction`.
