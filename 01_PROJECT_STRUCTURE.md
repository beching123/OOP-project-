# 01 – Directory Structure & What Lives Where

```text
src/
├── main/
│   ├── java/com/company/ecommerce/
│   │   ├── app/                  # Foundation: DbConnection, TransactionManager, Security, Session
│   │   ├── integration/          # Interfaces for payment, printer, email; adapters
│   │   ├── model/                # POJOs: User, Product, Order, OrderItem, AuditRecord, exceptions
│   │   ├── persistence/          # Repositories: UserRepo, ProductRepo, OrderRepo, etc.
│   │   ├── service/              # Business logic: TradeService, CartService, IdentityService, etc.
│   │   └── ui/views/
│   │       ├── admin/            # AdminDashboard, SystemSettings, AuditLogViewer
│   │       ├── staff/            # PosTerminal, StockReceiving
│   │       └── customer/         # Storefront, Cart, Checkout, Receipt
│   └── resources/
│       ├── sql/
│       │   ├── schema.sql
│       │   └── seed_data.sql
│       ├── static/images/        # Logos, product photos
│       └── application.properties
└── test/
    └── java/com/company/ecommerce/
        ├── app/
        ├── integration/
        ├── model/
        ├── persistence/
        ├── service/
        └── ui/
```

## Rules for Each Folder

- **`app`**: Singletons that manage application lifecycle, connections, and cross‑cutting concerns. No business logic.
- **`integration`**: Only interfaces and their implementations for external systems. Never calls repositories directly (except maybe to read config).
- **`model`**: Plain data carriers. No annotations, no logic. `version` fields are `int`; `BigDecimal` for money; `AuditRecord` is immutable.
- **`persistence`**: Each class ends in `Repo`. Methods only execute SQL and map results. No `commit()` or `rollback()`. They throw `StaleDataException` on version conflicts.
- **`service`**: The only layer that uses `TransactionManager`, calls repos, enforces permissions, and triggers audits. Every method that changes data must accept the acting `User`.
- **`ui/views`**: Vaadin components. They inject services, call their methods, and react to events. They never touch the database directly.

No developer creates additional packages without your approval.
