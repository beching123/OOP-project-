import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, Shield, BarChart3, Headphones, Package } from 'lucide-react';
import useAuthStore, { getRolePortal } from '../stores/authStore';
import { authService } from '../services/adminService';
import styles from './LoginPage.module.css';

import loginImg from '../../../trendora/src/assets/images resouces/Businesses Trust SDH.webp';

const highlights = [
  { icon: Shield, text: 'Secure access' },
  { icon: BarChart3, text: 'Real-time analytics' },
  { icon: Headphones, text: '24/7 support tools' },
];

const features = [
  { icon: Package, title: 'Inventory Control', desc: 'Manage products and stock levels' },
  { icon: BarChart3, title: 'Sales Analytics', desc: 'Track revenue and performance' },
  { icon: Headphones, title: 'Customer Support', desc: 'Handle tickets and inquiries' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authService.login({ email, password });
      const role = data.role || data.user?.role || '';
      const allowedRoles = ['ROLE_ADMIN', 'ADMIN', 'ROLE_CASHIER', 'CASHIER', 'ROLE_ORDER_PROCESSOR', 'ORDER_PROCESSOR', 'ROLE_SUPPORT_AGENT', 'SUPPORT_AGENT', 'ROLE_INVENTORY_MANAGER', 'INVENTORY_MANAGER'];
      if (!allowedRoles.includes(role)) {
        setError('Access denied. Admin or staff accounts only.');
        setLoading(false);
        return;
      }
      const user = data.user || { id: data.id, username: data.username, fullName: data.fullName || data.name, role };
      const token = data.token || data.accessToken;
      login(user, token);
      navigate(getRolePortal());
    } catch (err) {
      const demoUsers = {
        admin: { id: 1, username: 'admin', fullName: 'Admin User', role: 'ROLE_ADMIN' },
        cashier: { id: 2, username: 'cashier', fullName: 'Cashier Staff', role: 'ROLE_CASHIER' },
        processor: { id: 3, username: 'processor', fullName: 'Order Processor', role: 'ROLE_ORDER_PROCESSOR' },
        support: { id: 4, username: 'support', fullName: 'Support Agent', role: 'ROLE_SUPPORT_AGENT' },
        inventory: { id: 5, username: 'inventory', fullName: 'Inventory Manager', role: 'ROLE_INVENTORY_MANAGER' },
      };
      const demoUser = demoUsers[email];
      if (demoUser && password === 'admin123') {
        login(demoUser, 'demo-token');
        navigate(getRolePortal());
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || 'Backend offline. Use admin/admin123 for demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left - Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.portalBadge}>
            <Shield size={14} />
            Admin & Staff Portal
          </div>

          <div className={styles.logo}>Trend<span>ora</span></div>

          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to manage your store operations</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.08)',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 20,
              fontWeight: 500,
              border: '1px solid rgba(220, 38, 38, 0.12)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${styles.input} ${styles.inputPassword}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <span className={styles.forgotLink}>Forgot password?</span>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className={styles.highlights}>
            {highlights.map((item) => (
              <div key={item.text} className={styles.highlightItem}>
                <item.icon size={14} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Image */}
      <div className={styles.imageSide}>
        <img src={loginImg} alt="Trendora Management" className={styles.heroImage} />
        <div className={styles.imageOverlay} />
        <div className={styles.imageContent}>
          <div className={styles.heroCard}>
            <h2 className={styles.heroTitle}>Powerful Store Management</h2>
            <p className={styles.heroDesc}>
              Streamline operations, track performance, and manage your team all from one dashboard.
            </p>
            <div className={styles.heroFeatures}>
              {features.map((f) => (
                <div key={f.title} className={styles.heroFeature}>
                  <div className={styles.heroFeatureIcon}>
                    <f.icon size={20} color="#fff" />
                  </div>
                  <div>
                    <div className={styles.heroFeatureText}>{f.title}</div>
                    <div className={styles.heroFeatureDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
