# 04 – Persistence Layer: `com.company.ecommerce.persistence`

## Purpose
Execute raw SQL, map results to model objects. **No business logic, no transactions** (the service layer handles that).

## Global Rules
- All methods obtain the connection via `DbConnection.getConnection()`.
- All queries use `PreparedStatement` (prevent SQL injection).
- Write operations (INSERT/UPDATE/DELETE) that affect versioned tables **must** check `executeUpdate()` return value; if 0 rows, throw `StaleDataException`.
- Never call `commit()`, `rollback()`, or `setAutoCommit()` inside a repo.
- All resources (ResultSet, Statement) must be closed (try‑with‑resources).

## Required Repository Signatures

### `UserRepo`
- `Optional<User> findByUsername(String username)`
- `User save(User user)` — returns the user with generated id
- `void updatePassword(Long userId, String newPasswordHash)`
- `List<User> findAll()`

### `ProductRepo`
- `Optional<Product> findById(Long id)`
- `Optional<Product> findByBarcode(String barcode)`
- `List<Product> findAll()`
- `void decrementStock(Long productId, int quantity)` — must read current version first, then `UPDATE ... WHERE id = ? AND version = ?`. If 0 rows updated → `StaleDataException`.
- `void incrementStock(Long productId, int quantity)` — same version check.
- `void updatePrice(Long productId, BigDecimal newPrice)` — version check.

### `OrderRepo`
- `Order save(Order order)` — insert new, sets generated id and version.
- `void updateDraft(Order order)` — only updates when `status = DRAFT`, version check. Throws `StaleDataException` on conflict.
- `Optional<Order> findById(Long id)` — loads order with its `OrderItem` list.
- `void updateStatus(Long orderId, String newStatus, int expectedVersion)` — version check.
- `List<Order> findByStatus(String status)`

### `SettingsRepo`
- `Optional<String> findValueByKey(String key)`
- `Map<String, String> findAll()`
- `void save(String key, String value)` — upsert.

### `AuditRepo`
- `void save(AuditRecord audit)`
- `List<AuditRecord> findRecent(int limit)`
- `List<AuditRecord> findByFilter(LocalDateTime from, LocalDateTime to, Long userId, String action)` — all parameters nullable; build dynamic query.

## Testing
- Integration tests must run against H2 with the `test` Spring profile.
- Write tests that simulate concurrent updates and verify that `StaleDataException` is thrown.
