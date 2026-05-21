# 08 – Testing Strategy & Mandate

## Why Testing Matters (Brutal Truth)
Every bug that reaches Madam costs real money: double‑selling, missing stock, lost audit records. Your tests are the seatbelt.

## Required Testing Levels

### 1. Model & Exception Tests
- Ensure POJOs have correct equals/hashCode, immutability for `AuditRecord`.
- Verify exceptions can be instantiated and caught.

### 2. Repository Integration Tests
- Run with `@SpringBootTest` and `@ActiveProfiles("test")` (H2 in‑memory).
- For each write method, test:
  - Normal operation.
  - Version conflict (run two updates concurrently) – must throw `StaleDataException`.
  - Edge cases: zero quantity, negative stock.
- Clean the database before each test (`@Sql` scripts or `@Transactional` rollback).

### 3. Service Unit Tests
- Use `@ExtendWith(MockitoExtension.class)`, mock all repos and `TransactionManager`.
- Test `TradeService.checkout`:
  - Successful cash sale.
  - Payment failure (mock `PaymentGateway` throws exception) → verify stock not decremented.
  - Version conflict during stock update → verify retry logic.
  - Permissions: call without permission, expect `AccessDeniedException`.
- Ensure `AuditService.record` is called exactly once per state change.

### 4. Service Integration Tests (optional but recommended)
- Use a real `TransactionManager` and H2 to test the exact retry behaviour.

### 5. UI Tests
- Vaadin recommends `UIUnitTest` or browser‑based tests. At minimum, manually test the critical path: login → POS → scan → pay → receipt.

## Coverage Target
- **70% line coverage** per package. Measure with JaCoCo (add Maven plugin).
- Uncovered paths must be justified in a comment.

## Continuous Testing
- Every push must pass `mvn test` before merging.
- The lead will run the full suite before merging any feature into `develop`.
