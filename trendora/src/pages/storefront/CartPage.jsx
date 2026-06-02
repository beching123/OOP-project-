import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../../stores/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { getShippingCost } from '../../utils/constants';
import Button from '../../components/ui/Button';
import styles from './CartPage.module.css';

function getFreeShippingThreshold() {
  try {
    const stored = localStorage.getItem('trendora-admin-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.freeShippingThreshold || 50000;
    }
  } catch {}
  return 50000;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getItemCount, getSubtotal, getSavings, getDiscountedSubtotal } = useCartStore();
  const freeShippingThreshold = getFreeShippingThreshold();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const discountedSubtotal = getDiscountedSubtotal();
  const savings = getSavings();
  const shippingCost = getShippingCost('', '', discountedSubtotal);
  const total = discountedSubtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartIcon}>
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/catalog">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-8">
          Shopping <span className="text-primary">Cart</span>
        </h1>

        <div className={styles.cartLayout}>
          {/* Cart Items List */}
          <div className={styles.itemsList}>
            <div className={styles.listHeader}>
              <span className="font-semibold text-muted">{`${items.length} item(s)`}</span>
              <button 
                onClick={clearCart}
                className="text-error text-sm font-medium hover:underline flex items-center gap-1"
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div key={`${item.id}-${item.variant}`} className={styles.cartItem}>
                <Link to={`/product/${item.id}`} className={styles.itemImageWrapper}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                </Link>
                
                <div className={styles.itemInfo}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link to={`/product/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className={styles.itemVariant}>{item.variant}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={styles.itemPriceStack}>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className={styles.itemOriginalPrice}>{formatCurrency(item.originalPrice)}</span>
                        )}
                        <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)} className={styles.qtyBtn}><Minus size={14} /></button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)} className={styles.qtyBtn} disabled={item.quantity >= item.stock}><Plus size={14} /></button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id, item.variant)}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span className="text-muted">{`Subtotal (${items.length} item(s))`}</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className="text-muted">Discount</span>
                <span className="font-medium text-success">-{formatCurrency(savings)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className="text-muted">After Discount</span>
                <span className="font-medium">{formatCurrency(discountedSubtotal)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span className="text-muted flex items-center gap-1">
                  <Truck size={14} /> Shipping
                </span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-success">Free</span>
                  ) : formatCurrency(shippingCost)}
                </span>
              </div>

              {shippingCost > 0 && (
                <div className={styles.freeShippingBanner}>
                  {`Add ${formatCurrency(Math.max(0, freeShippingThreshold - discountedSubtotal))} more for FREE shipping`}
                </div>
              )}

              <div className="my-6 pt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                className="mb-4"
                onClick={() => navigate('/checkout')}
              >
                Place Order <ArrowRight size={20} className="ml-2" />
              </Button>
              
              <Link to="/catalog">
                <Button variant="outline" fullWidth>Continue Shopping</Button>
              </Link>
            </div>

            <div className={styles.checkoutTrust}>
              <ShieldCheck size={20} className="text-primary" />
              <span className="text-sm">Secure Checkout — 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
