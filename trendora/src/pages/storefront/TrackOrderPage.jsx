import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageSearch,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  Download,
  Printer,
  Trash2,
  History,
  MapPin,
  CreditCard,
  Mail,
  Pin,
  CircleCheck,
  ChevronDown,
  ShoppingCart,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { orderService } from '../../services/orderService';
import styles from './TrackOrderPage.module.css';

const ORDERS_STORAGE_KEY = 'trendora-orders';
const TRACKING_STORAGE_KEY = 'trendora.trackOrder.active';
const HISTORY_STORAGE_KEY = 'trendora.trackOrder.history';

const STEP_DEFS = [
  { key: 'DRAFT', label: 'Order placed', icon: Clock, description: 'We received your order and are preparing it.' },
  { key: 'PENDING_VERIFICATION', label: 'Awaiting Payment', icon: CircleCheck, description: 'Payment is being verified.' },
  { key: 'PAID', label: 'Paid', icon: Package, description: 'Payment confirmed. Your order is being processed.' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'The order is on the way to your address.' },
];

const formatCurrency = (value) => new Intl.NumberFormat('en-CM', {
  style: 'currency',
  currency: 'XAF',
  maximumFractionDigits: 0,
}).format(value);

const loadJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function loadOrders() {
  return loadJson(ORDERS_STORAGE_KEY, []);
}

function buildTrackingFromOrder(order) {
  const statusCycle = ['DRAFT', 'PENDING_VERIFICATION', 'PAID', 'SHIPPED'];
  const orderStatus = order.status?.toUpperCase() || 'DRAFT';
  const statusIndex = statusCycle.indexOf(orderStatus);
  const selectedStatus = statusIndex >= 0 ? orderStatus : 'DRAFT';

  const placedDate = new Date(order.createdAt);
  const estimatedDelivery = new Date(order.estimatedDelivery);

  const stepDates = STEP_DEFS.map((_, index) => {
    const date = new Date(placedDate);
    date.setDate(placedDate.getDate() + index);
    return date.toLocaleDateString();
  });

  return {
    id: order.orderId,
    email: order.customer.email,
    status: selectedStatus,
    date: placedDate.toLocaleDateString(),
    time: placedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estimatedDelivery: estimatedDelivery.toLocaleDateString(),
    courier: 'TRENDORA Express',
    trackingNumber: order.trackingNumber,
    lastUpdate: STEP_DEFS.find(s => s.key === selectedStatus)?.description || 'Order received',
    lastUpdateTime: `${placedDate.toLocaleDateString()} • ${placedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    lastLocation: order.delivery.method === 'direct_pickup' ? 'TRENDORA Store, Buea' : order.delivery.checkpoint?.name || 'Processing center',
    subtotal: order.totals.subtotal,
    discount: order.totals.savings,
    shipping: order.totals.shippingCost,
    total: order.totals.total,
    stepDates,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      details: `${item.variant || ''} · Qty ${item.quantity}`.trim(),
      price: item.price,
      total: item.lineTotal,
      image: item.image,
    })),
    address: {
      name: `${order.customer.firstName} ${order.customer.lastName}`,
      address: order.delivery.method === 'direct_pickup' ? 'TRENDORA Store, Buea' : `${order.delivery.checkpoint?.name || 'N/A'}, ${order.delivery.region}`,
      landmark: order.delivery.checkpoint?.description || '',
      phone: order.customer.phone,
    },
    payment: {
      method: order.payment.method,
      account: order.customer.phone,
    },
    deliveryMethod: order.delivery.method,
    orderData: order,
  };
}

function generateReceiptHTML(record) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TRENDORA Receipt - ${record.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; max-width: 700px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #22c55e; padding-bottom: 20px; }
    .brand { font-size: 28px; font-weight: 800; color: #22c55e; letter-spacing: 2px; }
    .tagline { color: #666; font-size: 12px; margin-top: 4px; }
    .title { font-size: 20px; font-weight: 700; margin-top: 15px; }
    .order-info { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .order-info div { text-align: center; }
    .order-info .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .order-info .value { font-size: 14px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { text-align: left; padding: 10px; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; color: #666; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
    .totals { margin-top: 20px; text-align: right; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals .grand-total { font-size: 18px; font-weight: 800; border-top: 2px solid #22c55e; padding-top: 10px; margin-top: 10px; color: #22c55e; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #dcfce7; color: #166534; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">TRENDORA</div>
    <div class="tagline">Affordable Quality, Delivered to You</div>
    <div class="title">Order Receipt</div>
  </div>

  <div class="order-info">
    <div>
      <div class="label">Order ID</div>
      <div class="value">${record.id}</div>
    </div>
    <div>
      <div class="label">Date</div>
      <div class="value">${record.date}</div>
    </div>
    <div>
      <div class="label">Status</div>
      <div class="value"><span class="status">${record.status}</span></div>
    </div>
    <div>
      <div class="label">Tracking</div>
      <div class="value">${record.trackingNumber}</div>
    </div>
  </div>

  <h3 style="margin: 20px 0 10px; font-size: 16px;">Items Ordered</h3>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${record.items.map(item => `
        <tr>
          <td>${item.name}${item.details ? ` (${item.details})` : ''}</td>
          <td>${item.details.match(/Qty (\d+)/)?.[1] || '1'}</td>
          <td style="text-align: right;">${formatCurrency(item.price)}</td>
          <td style="text-align: right;">${formatCurrency(item.total)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><span>${formatCurrency(record.subtotal)}</span></div>
    ${record.discount > 0 ? `<div><span>Discount</span><span>-${formatCurrency(record.discount)}</span></div>` : ''}
    <div><span>Shipping</span><span>${record.shipping === 0 ? 'Free' : formatCurrency(record.shipping)}</span></div>
    <div class="grand-total"><span>Total</span><span>${formatCurrency(record.total)}</span></div>
  </div>

  <div class="order-info" style="margin-top: 30px;">
    <div style="text-align: left;">
      <div class="label">Shipping Address</div>
      <div class="value" style="font-size: 13px;">${record.address.name}<br>${record.address.address}${record.address.landmark ? `<br>${record.address.landmark}` : ''}<br>${record.address.phone}</div>
    </div>
    <div style="text-align: right;">
      <div class="label">Payment Method</div>
      <div class="value">${record.payment.method}</div>
      <div class="value" style="font-size: 12px; color: #666;">${record.payment.account}</div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for shopping with TRENDORA!</p>
    <p>For support, contact us via WhatsApp or email.</p>
    <p style="margin-top: 8px;">This receipt was generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
}

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || '';
  const initialEmailParam = searchParams.get('email') || '';
  const initialActive = loadJson(TRACKING_STORAGE_KEY, null);
  const initialOrderNumber = initialOrderId || initialActive?.id || '';
  const initialEmail = initialEmailParam || initialActive?.email || '';
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => loadJson(HISTORY_STORAGE_KEY, []));
  const [historyCollapsed, setHistoryCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (trackingData) {
      window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(trackingData));
    } else {
      window.localStorage.removeItem(TRACKING_STORAGE_KEY);
    }
  }, [trackingData]);

  useEffect(() => {
    if (initialOrderId && initialEmailParam) {
      loadOrderFromStorage(initialOrderId, initialEmailParam);
    }
  }, []);

  const latestTracked = useMemo(() => history[0] ?? null, [history]);

  const currentStepIndex = trackingData
    ? Math.max(0, STEP_DEFS.findIndex((step) => step.key === trackingData.status))
    : -1;

  async function loadOrderFromStorage(orderId, emailAddr) {
    setLoading(true);
    try {
      const response = await orderService.trackOrder(orderId);
      const order = response.data;
      if (order) {
        const record = buildTrackingFromOrder(order);
        setTrackingData(record);
        setHistory((existing) => {
          const filtered = existing.filter((item) => item.id !== record.id);
          return [record, ...filtered].slice(0, 10);
        });
        toast.success(`Order ${orderId} loaded successfully!`);
      } else {
        toast.error('Order not found. Please check your order ID and email.');
        setTrackingData(null);
      }
    } catch {
      toast.error('Order not found. Please check your order ID and email.');
      setTrackingData(null);
    }
    setLoading(false);
  }

  const handleTrack = (event) => {
    event.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;
    loadOrderFromStorage(orderNumber.trim(), email.trim());
  };

  const handleClearTracking = () => {
    if (!trackingData) return;
    setHistory((existing) => {
      const filtered = existing.filter((item) => item.id !== trackingData.id);
      return [trackingData, ...filtered].slice(0, 10);
    });
    setTrackingData(null);
    setOrderNumber('');
    setEmail('');
  };

  const handleOpenHistory = (record) => {
    setTrackingData(record);
    setOrderNumber(record.id);
    setEmail(record.email || '');
  };

  const handleDownloadReceipt = () => {
    if (!trackingData) return;
    const html = generateReceiptHTML(trackingData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRENDORA-Receipt-${trackingData.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  };

  const handlePrintReceipt = () => {
    if (!trackingData) return;
    const html = generateReceiptHTML(trackingData);
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const stepStatus = (index) => {
    if (!trackingData) return 'upcoming';
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const historyLabel = history.length > 0 ? `Recent tracked orders (${history.length})` : 'Tracking history';
  const supportActionsDisabled = !trackingData;

  return (
    <div className={`container py-16 max-w-6xl min-h-[70vh] ${styles.pageShell}`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Track Order</h1>
        <p className={styles.pageSubtitle}>Track your order, review details, and download your receipt anytime.</p>
      </div>

      <div className={styles.searchCard}>
        <div className={styles.sectionLabel}>Search order</div>
        <p className={styles.sectionSubtitle}>Use your order ID and email address to pull up the latest shipment info.</p>

        <form onSubmit={handleTrack} className={styles.searchForm}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Order ID</span>
            <div className={styles.inputWrap}>
              <PackageSearch className={styles.inputIcon} size={18} />
              <input
                type="text"
                placeholder="e.g. ORD-123456"
                className={styles.input}
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Email address</span>
            <div className={styles.inputWrap}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                type="email"
                placeholder="name@email.com"
                className={styles.input}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>

          <Button type="submit" size="lg" isLoading={loading} className={styles.searchButton} fullWidth>
            <PackageSearch size={18} />
            Track Order
          </Button>
        </form>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {trackingData ? (
            <>
              <section className={styles.identityCard}>
                <div className={styles.identityHeader}>
                  <div>
                    <div className={styles.sectionLabel}>Order identity</div>
                    <div className={styles.identityTitleRow}>
                      <h2 className={styles.identityTitle}>{trackingData.id}</h2>
                      <span className={styles.statusBadge} data-status={trackingData.status.toLowerCase()}>
                        {trackingData.status}
                      </span>
                    </div>
                    <p className={styles.identityMeta}>
                      Placed on {trackingData.date} at {trackingData.time}
                    </p>
                  </div>

                  <div className={styles.identityActions}>
                    <Button variant="outline" size="sm" className={styles.iconButton} onClick={handleDownloadReceipt}>
                      <Download size={16} />
                      Download Receipt
                    </Button>
                    <Button variant="outline" size="sm" className={styles.iconButton} onClick={handlePrintReceipt}>
                      <Printer size={16} />
                      Print Receipt
                    </Button>
                    <Button variant="ghost" size="sm" className={styles.iconButtonDanger} onClick={handleClearTracking}>
                      <Trash2 size={16} />
                      Clear
                    </Button>
                  </div>
                </div>

                <div className={styles.stepperWrap}>
                  <div className={styles.stepperTrack} />
                  <div
                    className={styles.stepperFill}
                    style={{ width: `${(currentStepIndex / (STEP_DEFS.length - 1)) * 100}%` }}
                  />
                  {STEP_DEFS.map((step, index) => {
                    const status = stepStatus(index);
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className={styles.step}>
                        <div className={`${styles.stepCircle} ${styles[`stepCircle-${status}`]}`}>
                          <StepIcon size={18} />
                        </div>
                        <span className={`${styles.stepLabel} ${status === 'upcoming' ? styles.stepLabelMuted : ''}`}>{step.label}</span>
                        <span className={styles.stepDate}>{index <= currentStepIndex ? trackingData.stepDates?.[index] || trackingData.date : 'Pending'}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={styles.timelineCard}>
                <div className={styles.sectionLabel}>Tracking timeline</div>
                <p className={styles.sectionSubtitle}>A full step-by-step history of your shipment.</p>

                <div className={styles.timelineList}>
                  {STEP_DEFS.map((step, index) => {
                    const status = stepStatus(index);
                    const StepIcon = step.icon;
                    const isLast = index === STEP_DEFS.length - 1;

                    return (
                      <div key={step.key} className={styles.timelineItem}>
                        <div className={styles.timelineRail}>
                          <div className={`${styles.timelineDot} ${styles[`timelineDot-${status}`]}`}>
                            <StepIcon size={16} />
                          </div>
                          {!isLast && <div className={`${styles.timelineLine} ${status === 'completed' ? styles.timelineLineDone : ''}`} />}
                        </div>

                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTopRow}>
                            <h3 className={styles.timelineTitle}>{step.label}</h3>
                            {status === 'current' && <span className={styles.currentPill}>Current</span>}
                          </div>
                          <p className={styles.timelineTime}>
                            {status === 'upcoming' ? 'Waiting for update' : trackingData.stepDates?.[index] || trackingData.date}
                          </p>
                          <p className={styles.timelineDesc}>{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={styles.infoCard}>
                <div className={styles.sectionLabel}>Tracking information</div>
                <p className={styles.sectionSubtitle}>Courier details and the latest movement on the package.</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoField}>
                    <span className={styles.infoLabel}>Courier</span>
                    <span className={styles.infoValue}>{trackingData.courier}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.infoLabel}>Tracking number</span>
                    <span className={styles.infoValue}>{trackingData.trackingNumber}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.infoLabel}>Status</span>
                    <span className={`${styles.statusBadge} ${styles.statusInline}`} data-status={trackingData.status.toLowerCase()}>
                      {trackingData.status}
                    </span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.infoLabel}>Estimated delivery</span>
                    <span className={styles.infoValue}>{trackingData.estimatedDelivery}</span>
                  </div>
                </div>

                <div className={styles.lastUpdateBox}>
                  <div className={styles.lastUpdateTop}>
                    <span className={styles.infoLabel}>Last update</span>
                    <span className={styles.lastUpdateTime}>{trackingData.lastUpdateTime}</span>
                  </div>
                  <p className={styles.lastUpdateMessage}>{trackingData.lastUpdate}</p>
                  <div className={styles.lastUpdateLocation}>
                    <Pin size={14} />
                    <span>{trackingData.lastLocation}</span>
                  </div>
                </div>
              </section>

              <section className={styles.itemsCard}>
                <div className={styles.sectionLabel}>Order items</div>
                <div className={styles.itemsList}>
                  {trackingData.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <div className={styles.itemThumb}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                        ) : (
                          <Package size={18} />
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemDetails}>{item.details}</p>
                      </div>
                      <div className={styles.itemTotals}>
                        <span className={styles.itemPriceLabel}>Unit</span>
                        <span>{formatCurrency(item.price)}</span>
                        <span className={styles.itemPriceLabel}>Line total</span>
                        <span>{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.itemsFooter}>
                  <span>{trackingData.items.length} item(s)</span>
                  <strong>{formatCurrency(trackingData.total)}</strong>
                </div>
              </section>

              <div className={styles.dualGrid}>
                <section className={styles.detailCard}>
                  <div className={styles.sectionLabel}>
                    <MapPin size={16} />
                    Shipping address
                  </div>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}><span>Recipient</span><strong>{trackingData.address.name}</strong></div>
                    <div className={styles.detailRow}><span>Address</span><strong>{trackingData.address.address}</strong></div>
                    {trackingData.address.landmark && <div className={styles.detailRow}><span>Landmark</span><strong>{trackingData.address.landmark}</strong></div>}
                    <div className={styles.detailRow}><span>Phone</span><strong>{trackingData.address.phone}</strong></div>
                  </div>
                </section>

                <section className={styles.detailCard}>
                  <div className={styles.sectionLabel}>
                    <CreditCard size={16} />
                    Payment method
                  </div>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}><span>Method</span><strong>{trackingData.payment.method}</strong></div>
                    <div className={styles.detailRow}><span>Account</span><strong>{trackingData.payment.account}</strong></div>
                    <div className={styles.detailRow}><span>Subtotal</span><strong>{formatCurrency(trackingData.subtotal)}</strong></div>
                    <div className={styles.detailRow}><span>Discount</span><strong className={styles.discountText}>-{formatCurrency(trackingData.discount)}</strong></div>
                    <div className={styles.detailRow}><span>Delivery cost</span><strong>{trackingData.shipping === 0 ? 'Free' : formatCurrency(trackingData.shipping)}</strong></div>
                    <div className={`${styles.detailRow} ${styles.detailRowTotal}`}>
                      <span>Total</span>
                      <strong>{formatCurrency(trackingData.total)}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <section className={styles.helpBar}>
                <h3 className={styles.helpTitle}>Need a hand with this order?</h3>
                <p className={styles.helpSubtitle}>
                  Support is ready if you need help with delivery, payment, or a correction.
                </p>
                <div className={styles.helpActions}>
                  <Button size="sm" disabled={supportActionsDisabled}>WhatsApp Support</Button>
                  <Button size="sm" variant="outline" disabled={supportActionsDisabled}>Contact Support</Button>
                  <Button size="sm" variant="ghost" className={styles.dangerButton} disabled={supportActionsDisabled}>Cancel Order</Button>
                </div>
              </section>

            </>
          ) : (
            <section className={styles.emptyState}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <ShoppingCart size={48} style={{ color: 'var(--color-text-muted)' }} />
                <h2 className={styles.emptyTitle}>No active tracking yet</h2>
                <p className={styles.emptyText}>
                  Search with your order ID and email to open the live shipment view. Your tracked orders will stay in history too.
                </p>
                <Link to="/catalog">
                  <Button>Browse Catalog</Button>
                </Link>
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.historyCard}>
            <div className={styles.historyHeader}>
              <div className={styles.sectionLabel}>
                <History size={16} />
                {historyLabel}
              </div>
              <div className={styles.historyHeaderActions}>
                {latestTracked && <button type="button" className={styles.historyClear} onClick={() => setHistory([])}>Clear history</button>}
                <button
                  type="button"
                  className={styles.historyToggle}
                  onClick={() => setHistoryCollapsed((value) => !value)}
                  aria-expanded={!historyCollapsed}
                  aria-label={historyCollapsed ? 'Expand tracking history' : 'Collapse tracking history'}
                >
                  <ChevronDown size={16} className={historyCollapsed ? styles.historyToggleIconCollapsed : styles.historyToggleIcon} />
                </button>
              </div>
            </div>
            <p className={styles.sectionSubtitle}>Open any previous order to check its status again.</p>

            {!historyCollapsed && (
              <div className={styles.historyList}>
                {history.length === 0 && <p className={styles.historyEmpty}>Tracked orders will appear here after you search.</p>}
                {history.map((record) => (
                  <button key={`${record.id}-${record.date}`} type="button" className={styles.historyItem} onClick={() => handleOpenHistory(record)}>
                    <div>
                      <div className={styles.historyItemTop}>
                        <strong>{record.id}</strong>
                        <span className={styles.statusBadge} data-status={record.status.toLowerCase()}>{record.status}</span>
                      </div>
                      <p className={styles.historyMeta}>{record.email}</p>
                      <p className={styles.historyMeta}>{record.date}</p>
                    </div>
                    <span className={styles.historyOpen}>Open</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className={styles.tipCard}>
            <div className={styles.sectionLabel}>
              <FileText size={16} />
              Receipt & Invoice
            </div>
            <p className={styles.tipText}>
              After placing an order, use the Download or Print buttons above to get your receipt. Your order data is saved and can be accessed anytime.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
