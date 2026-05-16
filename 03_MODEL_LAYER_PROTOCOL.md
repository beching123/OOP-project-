# 03 – Model Layer: `com.company.ecommerce.model`

## Purpose
Data carriers. No logic, no framework annotations. The **single source of truth** for the shape of data.

## Required Classes & Fields

### `User`
| Field | Type | Notes |
|-------|------|-------|
| id | Long | Primary key |
| username | String | Unique |
| passwordHash | String | BCrypt hash |
| roles | List<String> | e.g., "ADMIN","CASHIER" |
| permissions | List<String> | Fine‑grained rights |

### `Product`
| Field | Type | Notes |
|-------|------|-------|
| id | Long | |
| barcode | String | Unique |
| name | String | |
| price | BigDecimal | Use `BigDecimal` for exact decimals |
| stock | int | |
| version | int | **Optimistic lock** – incremented in SQL only |

### `Order`
| Field | Type | Notes |
|-------|------|-------|
| id | Long | |
| status | String | Must use constants below |
| items | List<OrderItem> | |
| total | BigDecimal | |
| tax | BigDecimal | |
| customerId | Long | Nullable |
| cashierId | Long | Nullable |
| createdAt | LocalDateTime | |
| version | int | **Optimistic lock** |

Constants: `STATUS_DRAFT = "DRAFT"`, `STATUS_PAID = "PAID"`, `STATUS_VOID = "VOID"`, `STATUS_SHIPPED = "SHIPPED"`.

### `OrderItem`
| Field | Type | Notes |
|-------|------|-------|
| productId | Long | |
| productName | String | Snapshot of name at time of order |
| quantity | int | |
| unitPrice | BigDecimal | Price at time of order |

### `AppSetting`
| Field | Type |
|-------|------|
| key | String |
| value | String |

### `AuditRecord` (IMMUTABLE)
| Field | Type | Notes |
|-------|------|-------|
| id | Long | |
| timestamp | LocalDateTime | Auto‑set on creation |
| userId | Long | |
| userUsername | String | |
| action | String | e.g., "SALE", "STOCK_IN" |
| details | String | JSON or plain description |
| orderId | Long | Optional |

All fields `final`. Constructor with all args. No setters. Getters only.

### Exceptions
- `StaleDataException extends RuntimeException`
- `InsufficientStockException extends RuntimeException`
- `AccessDeniedException extends RuntimeException`
- `PaymentException extends RuntimeException`

### `PaymentResult`
| Field | Type |
|-------|------|
| success | boolean |
| transactionId | String |
| errorMessage | String |

## Rules
- All model classes have `equals()` and `hashCode()` based on `id` (when applicable).
- Use `BigDecimal` for all monetary values – never `double` or `float`.
- `version` fields are managed by the database; your code must never manually increment them.
