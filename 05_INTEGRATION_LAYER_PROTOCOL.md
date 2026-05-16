# 05 – Integration Layer: `com.company.ecommerce.integration`

## Purpose
Wrap all external APIs and hardware so the rest of the system only depends on Java interfaces.

## Required Interfaces & Classes

### `PaymentGateway` (interface)
- `PaymentResult charge(Order order, Map<String,String> params) throws PaymentException`

Implementations:
- `MomoAdapter` – calls MTN MoMo API.
- `OrangeAdapter` – calls Orange Money API.

### `PrinterProvider` (interface)
- `void printReceipt(Order order)` – must never throw; failures are logged.

### `EmailProvider` (interface)
- `void sendEmail(String to, String subject, String htmlBody)` – never throws.

### `BarcodeInputListener` (concrete helper, `@Component`)
- `Product lookupByBarcode(String barcode)` — simply delegates to `CatalogService.lookupByBarcode()`.

## Design Rules
- Payment gateways are allowed to be called **inside a transaction** (by `TradeService`) because the payment must be confirmed before stock is committed. If they fail, the whole transaction rolls back.
- Printer and Email are always called **after** the database transaction, via `BackgroundWorker`. They must not use the request‑scoped connection; they either open their own transient connection or call an external service.
- All adapter implementations must handle network timeouts and return appropriate error states (throw `PaymentException` for payments, log and swallow for printer/email).

## Testing
- Mock the external HTTP/SMTP calls. Verify that payment failure triggers a rollback (service test), and that printer/email failures do not propagate.
