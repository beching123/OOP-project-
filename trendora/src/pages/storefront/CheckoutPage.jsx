import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Banknote, ShieldCheck, MapPin, Smartphone, FileText, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../../stores/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { PAYMENT_METHODS, getCheckpointsByCity, CAMEROON_REGIONS, SHIPPING_RATES, getShippingCost } from '../../utils/constants';
import { paymentService } from '../../services/paymentService';
import { orderService } from '../../services/orderService';
import Button from '../../components/ui/Button';
import styles from './CheckoutPage.module.css';

const ORDERS_STORAGE_KEY = 'trendora-orders';

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateTrackingNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRD-';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getDiscountedSubtotal, getSavings } = useCartStore();
  const [step, setStep] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = getSubtotal();
  const discountedSubtotal = getDiscountedSubtotal();
  const savings = getSavings();
  const isBuea = selectedRegion === 'South-West' && selectedCity === 'Buea';

  const shippingCost = selectedPaymentId === '' || selectedRegion === ''
    ? 0
    : getShippingCost(selectedRegion, selectedCity, discountedSubtotal);

  const total = discountedSubtotal + shippingCost;

  const availableCheckpoints = selectedCity ? getCheckpointsByCity(selectedCity) : [];

  const citiesByRegion = {
    'South-West': ['Buea', 'Limbe', 'Kumba', 'Mamfe', 'Tiko'],
    'North-West': ['Bamenda', 'Bafoussam', 'Nkambe', 'Wum', 'Fundong'],
    'Littoral': ['Douala', 'Edéa', 'Nkongsamba', 'Limbe'],
    'Centre': ['Yaoundé', 'Mbalmayo', 'Ebolowa', 'Bafia'],
    'West': ['Bafoussam', 'Dschang', 'Bamendjou', 'Foumban'],
    'East': ['Bertoua', 'Batouri', 'Yokadouma'],
    'South': ['Ebolowa', 'Ambam', 'Kribi', 'Lolodorf'],
    'North': ['Garoua', 'Maroua', 'Ngaoundéré', 'Kousséri'],
    'Adamawa': ['Ngaoundéré', 'Tignère', 'Meiganga', 'Banyo'],
    'Far North': ['Maroua', 'Kousséri', 'Yagoua', 'Mokolo'],
  };

  const cities = citiesByRegion[selectedRegion] || [];

  if (items.length === 0 && !orderSuccess) {
    return <Navigate to="/cart" replace />;
  }

  const renderPaymentIcon = (methodId) => {
    switch (methodId) {
      case 'mtn_momo':
      case 'orange_money':
        return <Smartphone size={22} />;
      case 'bank_card':
        return <CreditCard size={22} />;
      case 'cash_on_delivery':
        return <Banknote size={22} />;
      default:
        return null;
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentId(methodId);
    setStep(2);
  };

  const handleLocationSubmit = () => {
    if (!selectedRegion) {
      toast.error('Please select your region');
      return;
    }
    if (!selectedCity) {
      toast.error('Please select your city');
      return;
    }
    setStep(3);
  };

  const handleCheckpointSubmit = () => {
    if (!selectedCheckpoint) {
      toast.error('Please select a pickup checkpoint');
      return;
    }
    setStep(4);
  };

  const handleMakePayment = async () => {
    if (!customerFirstName.trim() || !customerLastName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!customerEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (selectedPaymentId === 'mtn_momo' || selectedPaymentId === 'orange_money') {
      if (!phoneNumber.trim()) {
        toast.error('Please enter your phone number');
        return;
      }
    }
    if (selectedPaymentId === 'bank_card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    const paymentMethod = PAYMENT_METHODS.find((m) => m.id === selectedPaymentId);
    const checkpoint = availableCheckpoints.find((cp) => cp.id === selectedCheckpoint);

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);

    let paymentStatus = 'pending';
    try {
      const paymentRes = await paymentService.initiate({
        orderId: Date.now(),
        methodId: paymentMethod.id,
        amount: total,
        phoneNumber: phoneNumber || undefined,
        email: customerEmail || undefined,
      });
      const verifyRes = await paymentService.verify(paymentRes.data.transactionId);
      paymentStatus = verifyRes.data.status === 'completed' ? 'completed' : 'pending';
    } catch {
      paymentStatus = 'pending';
    }

    const order = {
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      trackingNumber: `TRD-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: item.quantity,
        variant: item.variant,
        lineTotal: item.price * item.quantity,
      })),
      customer: {
        firstName: customerFirstName,
        lastName: customerLastName,
        email: customerEmail,
        phone: phoneNumber,
      },
      delivery: {
        method: 'checkpoint',
        region: selectedRegion,
        city: selectedCity,
        checkpoint: checkpoint,
        shippingCost,
      },
      payment: {
        method: paymentMethod.name,
        methodId: paymentMethod.id,
        phone: phoneNumber,
        amount: total,
        status: paymentStatus,
      },
      totals: {
        subtotal,
        savings,
        discountedSubtotal,
        shippingCost,
        total,
      },
      estimatedDelivery: estimatedDate.toLocaleDateString(),
    };

    const existingOrders = loadOrders();
    saveOrders([order, ...existingOrders]);

    try {
      await orderService.createOrder({
        items: items.map(item => ({
          id: item.apiId || item.id?.replace('api-', '') || 0,
          quantity: item.quantity,
        })),
        delivery: {
          method: 'checkpoint',
          region: selectedRegion,
          city: selectedCity,
          checkpointId: checkpoint?.name || '',
        },
        payment: {
          methodId: paymentMethod.id,
        },
      });
    } catch {
      // Backend not available — order still saved locally
    }

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedOrder(order);
      setOrderSuccess(true);
      toast.success(`Order ${order.orderId} placed successfully!`);
    }, 2000);
  };

  const handleGetReceipt = () => {
    if (!completedOrder) return;
    clearCart();
    navigate(`/track-order?id=${completedOrder.orderId}&email=${encodeURIComponent(completedOrder.customer.email)}`);
  };

  if (orderSuccess && completedOrder) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container py-16">
          <div className={styles.successOverlay}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted mb-4">Your order has been placed and is being processed.</p>
              
              <div className={styles.successOrderInfo}>
                <div className={styles.successInfoRow}>
                  <span>Order ID</span>
                  <strong>{completedOrder.orderId}</strong>
                </div>
                <div className={styles.successInfoRow}>
                  <span>Tracking Number</span>
                  <strong>{completedOrder.trackingNumber}</strong>
                </div>
                <div className={styles.successInfoRow}>
                  <span>Payment Method</span>
                  <strong>{completedOrder.payment.method}</strong>
                </div>
                <div className={styles.successInfoRow}>
                  <span>Total Paid</span>
                  <strong className="text-primary">{formatCurrency(completedOrder.totals.total)}</strong>
                </div>
                <div className={styles.successInfoRow}>
                  <span>Pickup Location</span>
                  <strong>{completedOrder.delivery.checkpoint?.name}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button size="lg" fullWidth onClick={handleGetReceipt}>
                  <FileText size={18} className="mr-2" />
                  Get Receipt & Track Order
                </Button>
                <Button size="lg" fullWidth variant="outline" onClick={() => {
                  setOrderSuccess(false);
                  setCompletedOrder(null);
                  navigate('/cart');
                }}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={`container ${styles.checkoutContainer}`}>
        
        {/* Left Column: Steps */}
        <div className={styles.stepsCol}>
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* STEP 1: Select Payment Method */}
          <div className={`${styles.stepCard} ${step === 1 ? styles.stepActive : ''}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepIndicator}>
                {step > 1 ? <CheckCircle2 size={24} /> : '1'}
              </div>
              <h2 className={styles.stepTitle}>Select Payment Method</h2>
              {step > 1 && (
                <button className={styles.editBtn} onClick={() => setStep(1)}>Change</button>
              )}
            </div>

            {step === 1 && (
              <div className={styles.stepBody}>
                <p className="text-muted mb-4">Choose how you'd like to pay for your order.</p>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      className={`${styles.paymentOption} ${selectedPaymentId === method.id ? styles.paymentOptionActive : ''}`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <div className={styles.paymentOptionIcon}>
                        {renderPaymentIcon(method.id)}
                      </div>
                      <div className={styles.paymentOptionInfo}>
                        <span className="font-bold">{method.name}</span>
                        <span className="text-sm text-muted">
                          {method.id === 'mtn_momo' && 'Pay with MTN Mobile Money'}
                          {method.id === 'orange_money' && 'Pay with Orange Money'}
                          {method.id === 'bank_card' && 'Pay with Visa, Mastercard'}
                          {method.id === 'cash_on_delivery' && 'Pay when you receive your order'}
                        </span>
                      </div>
                      <ArrowRight size={18} className="text-muted" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Enter Location */}
          <div className={`${styles.stepCard} ${step === 2 ? styles.stepActive : ''} ${step < 2 ? styles.stepDisabled : ''}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepIndicator}>
                {step > 2 ? <CheckCircle2 size={24} /> : '2'}
              </div>
              <h2 className={styles.stepTitle}>Your Location</h2>
              {step > 2 && (
                <button className={styles.editBtn} onClick={() => setStep(2)}>Change</button>
              )}
            </div>

            {step === 2 && (
              <div className={styles.stepBody}>
                <p className="text-muted mb-4">Enter your location to see available pickup points near you.</p>
                
                <div className="mb-4">
                  <label className={styles.label}>
                    <MapPin size={14} className="inline mr-1" />
                    Region
                  </label>
                  <select 
                    className={styles.input}
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedCity('');
                      setSelectedCheckpoint('');
                    }}
                  >
                    <option value="">Select your region</option>
                    {CAMEROON_REGIONS.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {selectedRegion && (
                  <div className="mb-4">
                    <label className={styles.label}>City / Area</label>
                    <select 
                      className={styles.input}
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedCheckpoint('');
                      }}
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedRegion && selectedCity && (
                  <div className={styles.locationInfo}>
                    <p className="text-sm">
                      <strong>{selectedCity}</strong> is in <strong>{selectedRegion}</strong> region.
                      {isBuea 
                        ? 'Shipping within Buea costs XAF 1,000.'
                        : 'Shipping outside Buea costs XAF 2,000.'}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <Button onClick={handleLocationSubmit} fullWidth>Continue to Checkpoints</Button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Select Checkpoint */}
          <div className={`${styles.stepCard} ${step === 3 ? styles.stepActive : ''} ${step < 3 ? styles.stepDisabled : ''}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepIndicator}>
                {step > 3 ? <CheckCircle2 size={24} /> : '3'}
              </div>
              <h2 className={styles.stepTitle}>Select Pickup Checkpoint</h2>
              {step > 3 && (
                <button className={styles.editBtn} onClick={() => setStep(3)}>Change</button>
              )}
            </div>

            {step === 3 && (
              <div className={styles.stepBody}>
                <p className="text-muted mb-4">
                  {`Choose a pickup point in ${selectedCity}. These are the available checkpoints near your area.`}
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {availableCheckpoints.map((cp) => (
                    <button
                      key={cp.id}
                      type="button"
                      className={`${styles.checkpointOption} ${selectedCheckpoint === cp.id ? styles.checkpointOptionActive : ''}`}
                      onClick={() => setSelectedCheckpoint(cp.id)}
                    >
                      <div className={styles.checkpointRadio}>
                        <div className={`${styles.radioDot} ${selectedCheckpoint === cp.id ? styles.radioDotActive : ''}`} />
                      </div>
                      <div className={styles.checkpointInfo}>
                        <span className="font-bold">{cp.name}</span>
                        <span className="text-sm text-muted">{cp.description}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <Button onClick={handleCheckpointSubmit} fullWidth>Continue to Payment</Button>
              </div>
            )}
          </div>

          {/* STEP 4: Confirm & Pay */}
          <div className={`${styles.stepCard} ${step === 4 ? styles.stepActive : ''} ${step < 4 ? styles.stepDisabled : ''}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepIndicator}>4</div>
              <h2 className={styles.stepTitle}>Confirm & Pay</h2>
            </div>

            {step === 4 && (
              <div className={styles.stepBody}>
                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Your Information</h3>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={styles.label}>First Name</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="John"
                          value={customerFirstName}
                          onChange={(e) => setCustomerFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={styles.label}>Last Name</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Doe"
                          value={customerLastName}
                          onChange={(e) => setCustomerLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={styles.label}>Email Address</label>
                      <input
                        type="email"
                        className={styles.input}
                        placeholder="john@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                      <p className="text-xs text-muted mt-1">Used to track your order</p>
                    </div>
                  </div>
                </div>

                {/* Order Total */}
                <div className={styles.totalBox}>
                  <div className={styles.totalRow}>
                    <span>Items</span>
                    <span>{formatCurrency(discountedSubtotal)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Discount</span>
                    <span className="text-success">-{formatCurrency(savings)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>{`Shipping (${isBuea ? 'Buea' : selectedRegion})`}</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                    <span>Total to Pay</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-6">
                  <h3 className="font-bold mb-3">Payment Details</h3>
                  
                  {(selectedPaymentId === 'mtn_momo' || selectedPaymentId === 'orange_money') && (
                    <div className="mb-4">
                      <label className={styles.label}>
                        {selectedPaymentId === 'mtn_momo' ? 'MTN Phone Number' : 'Orange Phone Number'}
                      </label>
                      <input
                        type="tel"
                        className={styles.input}
                        placeholder="e.g. 670000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-muted mt-1">
                        You'll receive a payment prompt on this number
                      </p>
                    </div>
                  )}

                  {selectedPaymentId === 'bank_card' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={styles.label}>Card Number</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={styles.label}>Expiry Date</label>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={styles.label}>CVV</label>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentId === 'cash_on_delivery' && (
                    <div className={styles.cashInfo}>
                      <Banknote size={20} />
                      <p className="text-sm">{`Pay ${formatCurrency(total)} in cash when your order arrives at the checkpoint.`}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button 
                    size="lg" 
                    fullWidth 
                    onClick={handleMakePayment}
                    isLoading={isProcessing}
                  >
                    {`Make Payment — ${formatCurrency(total)}`}
                  </Button>
                  <div className="text-center text-xs text-muted mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Payments are secure and encrypted.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.summaryCol}>
          <div className={styles.summaryBox}>
            <h3 className="text-lg font-bold mb-4 pb-4 border-b border-border">Order Summary</h3>
            
            <div className={styles.itemsScroll}>
              {items.map(item => (
                <div key={`${item.id}-${item.variant}`} className={styles.miniItem}>
                  <img src={item.image} alt={item.name} className={styles.miniImage} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                    {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="py-4 border-t border-b border-border mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Discount</span>
                <span className="text-success">-{formatCurrency(savings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span>{shippingCost === 0 ? 'TBD' : formatCurrency(shippingCost)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{shippingCost === 0 ? 'TBD' : formatCurrency(total)}</span>
            </div>

            {selectedPaymentId && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-primary-soft)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                  Payment: {PAYMENT_METHODS.find(m => m.id === selectedPaymentId)?.name}
                </p>
              </div>
            )}

            {selectedCheckpoint && (
              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-primary-soft)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                  Pickup Location: {availableCheckpoints.find(cp => cp.id === selectedCheckpoint)?.name}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
