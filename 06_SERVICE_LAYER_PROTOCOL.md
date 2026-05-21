# 06 – Service Layer: `com.company.ecommerce.service`

## Purpose
All business rules, permission enforcement, transaction management, and audit trail creation. The service layer is the **gatekeeper** between the UI and the data.

## Global Mandates
- Every data‑modifying public method must:
  1. Start a transaction (via `TransactionManager`).
  2. Call `IdentityService.assertPermission(user, permission)` if required.
  3. Call the necessary repositories.
  4. Call `AuditService.record(...)` for every state change.
  5. Commit or rollback.
- Post‑commit work (email, print) is submitted to `BackgroundWorker` **after** the commit.
- All such methods accept the acting `User` as a parameter.

## Required Service Classes & Method Signatures

### `IdentityService`
- `User authenticate(String username, String password)` – throws `AccessDeniedException` on failure.
- `void assertPermission(User user, String permission)` – throws `AccessDeniedException` if missing.

### `TradeService`
- `long checkout(long orderId, String paymentMethod, User cashier)` — may throw `PaymentException`, `InsufficientStockException`.
  - Inside transaction:
    - If payment not cash, call `PaymentGateway.charge()`.
    - Decrement stock for each item (version‑checked).
    - Change order status to `PAID`, set cashier.
    - Audit.
    - Commit.
    - Submit email/print jobs.
- `void voidSale(long orderId, User admin)` — reverse stock, change status to `VOID`, audit.
- `void receiveStock(long productId, int quantity, User receiver)` — increment stock, audit.
- `BigDecimal getDailyRevenue()` — read‑only.

### `CatalogService`
- `Product lookupByBarcode(String barcode)`
- `List<Product> getAllProducts()`
- `void updatePrice(long productId, BigDecimal newPrice, User admin)` — assert permission, transaction, audit.

### `CartService`
- `long createDraftOrder(User customer)` — returns the draft order id.
- `void addItemToCart(long orderId, long productId, int quantity, User user)` — version‑checked draft update, throws `StaleDataException`.
- `void updateItemQuantity(long orderId, long productId, int newQuantity, User user)`
- `void removeItem(long orderId, long productId, User user)`
- `Order getDraftOrder(long orderId)`
- `void deleteDraft(long orderId)` — only if status is DRAFT.

### `ConfigService`
- `String get(String key)`
- `String get(String key, String defaultValue)`
- `void set(String key, String value)`
- `Map<String,String> getAll()`

### `DocumentService`
- `String getReceiptHtml(Order order)` — uses shop name from config.
- `byte[] getReceiptPdf(Order order)` (optional but signature required).

### `AuditService`
- `void record(String action, Long orderId, User user, String details)` — inserts inside current transaction.
- `List<AuditRecord> getRecent(int limit)`
- `List<AuditRecord> search(LocalDateTime from, LocalDateTime to, Long userId, String action)`

### `NotificationService`
- `void sendReceipt(Order order)` — runs asynchronously, fetches customer email via `UserRepo`, calls `EmailProvider.sendEmail()`. Must never throw.

## Testing
- Unit tests with mocked repositories and `TransactionManager`.
- Integration test for `checkout` using H2, simulate version conflict and verify retry.
- Ensure that `AuditService.record` is called for every state change.
