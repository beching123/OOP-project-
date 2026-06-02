import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  Star,
  User,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import api from '../../services/api';
import headphoneImg from '../../assets/images resouces/electronics/headphone1.jpeg';
import watchImg from '../../assets/images resouces/electronics/smartwatch2.jpeg';
import perfumeImg from '../../assets/images resouces/perfume/perfume4.jpeg';
import bagImg from '../../assets/images resouces/clothe/women bags/bag7.jpeg';
import sofaImg from '../../assets/images resouces/house furnitures/chair1.jpeg';
import chair8Img from '../../assets/images resouces/house furnitures/chair8.jpg';
import airFryerImg from '../../assets/images resouces/electronics/airfryer.jpeg';
import shoesImg from '../../assets/images resouces/clothe/male ware/shoes1.jpeg';
import styles from './ProfilePage.module.css';

const defaultImages = [headphoneImg, watchImg, perfumeImg, bagImg, sofaImg, chair8Img, airFryerImg, shoesImg];

const initialWishlist = [
  { id: 'w1', name: 'Wireless Bluetooth Headphones', price: 25000, image: headphoneImg, stock: 99 },
  { id: 'w2', name: 'Smart Watch Pro', price: 45000, image: watchImg, stock: 99 },
  { id: 'w3', name: 'Premium Perfume', price: 8500, image: perfumeImg, stock: 99 },
  { id: 'w4', name: 'Designer Handbag', price: 35000, image: bagImg, stock: 99 },
];

const initialAddresses = [
  {
    id: 'a1',
    type: 'Home',
    address: 'Molyko Checkpoint, Buea, South-West Region, Cameroon',
    isDefault: true,
  },
  {
    id: 'a2',
    type: 'Office',
    address: 'Trendora HQ, Molyko, Buea, Cameroon',
    isDefault: false,
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CM', { style: 'decimal' }).format(amount) + ' XAF';
};

const statusConfig = {
  draft: { label: 'Order Placed', class: styles.statusProcessing, icon: Package },
  pending_verification: { label: 'Awaiting Payment', class: styles.statusProcessing, icon: Clock },
  paid: { label: 'Paid', class: styles.statusShipped, icon: Truck },
  shipped: { label: 'Shipped', class: styles.statusShipped, icon: Truck },
  void: { label: 'Cancelled', class: styles.statusCancelled, icon: XCircle },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [activeTab, setActiveTab] = useState('orders');
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ type: '', address: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const initialProfile = useMemo(
    () => ({
      name: user?.name || 'Trendora Customer',
      email: user?.email || 'support@trendora.cm',
      phone: user?.phone || '+237 600 00 00 00',
      location: user?.location || 'Molyko, Buea, Cameroon',
      avatar: user?.avatar || '',
    }),
    [user]
  );

  const [formState, setFormState] = useState(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState(initialProfile.avatar);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data?.content || res.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();

    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setWishlist(res.data?.items || []);
      } catch {
        setWishlist([]);
      }
    };
    fetchWishlist();

    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data?.addresses || []);
      } catch {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (field) => (event) => {
    setFormState((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setAvatarPreview(result);
      setFormState((current) => ({ ...current, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    try {
      const res = await authService.updateProfile({
        firstName: formState.name?.split(' ')[0] || formState.name,
        lastName: formState.name?.split(' ').slice(1).join(' ') || '',
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
      });
      const updatedUser = res.data;
      setUser({
        ...user,
        name: updatedUser.name || formState.name,
        email: updatedUser.email || formState.email,
        phone: updatedUser.phone || formState.phone,
        location: updatedUser.location || formState.location,
        avatar: avatarPreview || user.avatar,
      });
      toast.success('Profile updated successfully!');
    } catch {
      setUser({
        ...user,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
        avatar: avatarPreview,
      });
      toast.success('Profile updated!');
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    } catch {
      toast.error('Failed to update password. Check current password.');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const handleAddToCart = (item) => {
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId, itemName) => {
    setWishlist((prev) => prev.filter((w) => w.id !== itemId));
    toast.success(`${itemName} removed from wishlist.`);
  };

  const handleTrackOrder = (orderId) => {
    navigate('/track-order');
  };

  const handleViewOrderDetails = (orderId) => {
    navigate('/track-order');
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr.id);
    setAddressForm({ type: addr.type, address: addr.address });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addrId) => {
    setAddresses((prev) => prev.filter((a) => a.id !== addrId));
    toast.success('Address deleted.');
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();
    if (!addressForm.type.trim() || !addressForm.address.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress ? { ...a, type: addressForm.type, address: addressForm.address } : a
        )
      );
      toast.success('Address updated!');
    } else {
      const newAddr = {
        id: `a-${Date.now()}`,
        type: addressForm.type,
        address: addressForm.address,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
      toast.success('Address added!');
    }
    setAddressForm({ type: '', address: '' });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({ type: '', address: '' });
    setShowAddressForm(true);
  };

  const avatarLabel = formState.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: User },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.avatarWrapper}>
              {avatarPreview ? (
                <img src={avatarPreview} alt={formState.name} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatar}>{avatarLabel}</div>
              )}
              <label className={styles.avatarUpload}>
                <Pencil size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{formState.name}</h1>
              <p className={styles.userEmail}>{formState.email}</p>
              <div className={styles.userBadges}>
                <span className={`${styles.badge} ${styles.badgePrimary}`}>Verified Shopper</span>
                <span className={`${styles.badge} ${styles.badgeSecondary}`}>Trendora Member</span>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className={styles.statsRow}>
            <button type="button" className={styles.statCard} onClick={() => setActiveTab('orders')}>
              <div className={styles.statIcon}><Package size={20} /></div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{orders.length}</span>
                <span className={styles.statLabel}>Total Orders</span>
              </div>
            </button>
            <button type="button" className={styles.statCard} onClick={() => setActiveTab('wishlist')}>
              <div className={styles.statIcon}><Heart size={20} /></div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{wishlist.length}</span>
                <span className={styles.statLabel}>Wishlist Items</span>
              </div>
            </button>
            <button type="button" className={styles.statCard} onClick={() => setActiveTab('addresses')}>
              <div className={styles.statIcon}><MapPin size={20} /></div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{addresses.length}</span>
                <span className={styles.statLabel}>Saved Addresses</span>
              </div>
            </button>
            <button type="button" className={styles.statCard} onClick={() => navigate('/track-order')}>
              <div className={styles.statIcon}><Bell size={20} /></div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>1</span>
                <span className={styles.statLabel}>Support Tickets</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className={styles.ordersList}>
              {loadingOrders ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No orders yet.</p>
              ) : orders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <div className={styles.orderId}>{order.id}</div>
                        <div className={styles.orderDate}>{order.date}</div>
                      </div>
                      <div className={`${styles.statusBadge} ${status.class}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </div>
                    <div className={styles.orderItems}>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image || defaultImages[idx % defaultImages.length]} alt={item.name} className={styles.orderItemImg} />
                          <div className={styles.orderItemInfo}>
                            <div className={styles.orderItemName}>{item.name}</div>
                            <div className={styles.orderItemVariant}>{item.variant || ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.orderFooter}>
                      <div className={styles.orderTotal}>
                        <span>Total </span>{formatCurrency(order.total)}
                      </div>
                      <div className={styles.orderActions}>
                        {order.status === 'shipped' && (
                          <button type="button" className={styles.trackBtn} onClick={() => handleTrackOrder(order.id)}>
                            <Truck size={14} /> Track
                          </button>
                        )}
                        <button type="button" className={styles.detailsBtn} onClick={() => handleViewOrderDetails(order.id)}>
                          <ExternalLink size={14} /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className={styles.wishlistGrid}>
              {wishlist.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <Heart size={40} style={{ marginBottom: '1rem' }} />
                  <p>Your wishlist is empty.</p>
                  <button type="button" className={styles.addToCartBtn} onClick={() => navigate('/catalog')} style={{ marginTop: '1rem' }}>
                    Browse Products
                  </button>
                </div>
              )}
              {wishlist.map((item) => (
                <div key={item.id} className={styles.wishlistCard}>
                  <img src={item.image} alt={item.name} className={styles.wishlistImg} />
                  <div className={styles.wishlistInfo}>
                    <div className={styles.wishlistName}>{item.name}</div>
                    <div className={styles.wishlistPrice}>{formatCurrency(item.price)}</div>
                    <div className={styles.wishlistActions}>
                      <button type="button" className={styles.addToCartBtn} onClick={() => handleAddToCart(item)}>
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <button type="button" className={styles.removeBtn} onClick={() => handleRemoveFromWishlist(item.id, item.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className={styles.addressesGrid}>
              {addresses.map((addr) => (
                <div key={addr.id} className={styles.addressCard}>
                  {addr.isDefault && (
                    <div className={styles.addressDefault}>
                      <Star size={10} /> Default
                    </div>
                  )}
                  <div className={styles.addressType}>{addr.type}</div>
                  <div className={styles.addressText}>{addr.address}</div>
                  <div className={styles.addressActions}>
                    <button type="button" className={styles.editAddressBtn} onClick={() => handleEditAddress(addr)}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button type="button" className={styles.deleteAddressBtn} onClick={() => handleDeleteAddress(addr.id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addAddressCard} onClick={handleAddNewAddress}>
                <div className={styles.addAddressIcon}>
                  <Plus size={24} />
                </div>
                <div className={styles.addAddressText}>Add New Address</div>
              </button>
            </div>
          )}

          {/* Address Form Modal */}
          {showAddressForm && (
            <div className={styles.modalOverlay} onClick={() => setShowAddressForm(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.settingsTitle}>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleSaveAddress}>
                  <div className="flex flex-col gap-3">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Address Type</label>
                      <input
                        type="text"
                        value={addressForm.type}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, type: e.target.value }))}
                        placeholder="e.g. Home, Office, Warehouse"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Address</label>
                      <input
                        type="text"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your full address"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className={styles.saveBtn}>Save Address</button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setShowAddressForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <>
              <div className={styles.settingsCard}>
                <h3 className={styles.settingsTitle}>Personal Information</h3>
                <form onSubmit={handleSaveProfile}>
                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Name</label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={handleChange('name')}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={handleChange('email')}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={handleChange('phone')}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Location</label>
                      <input
                        type="text"
                        value={formState.location}
                        onChange={handleChange('location')}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <button type="submit" className={styles.saveBtn}>
                    Save Changes
                  </button>
                </form>
              </div>

              <div className={styles.settingsCard}>
                <h3 className={styles.settingsTitle}>Change Password</h3>
                <form onSubmit={handleUpdatePassword}>
                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className={styles.formInput}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className={styles.formInput}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className={styles.formInput}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={styles.saveBtn} style={{ marginTop: '1rem' }}>
                    Update Password
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

