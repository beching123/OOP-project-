import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import { authService } from '../../services/authService';
import styles from './LoginPage.module.css';

import loginImg from '../../assets/images resouces/(1) Instagram.jfif';

const highlights = [
  { icon: ShieldCheck, text: 'Secure checkout' },
  { icon: Truck, text: 'Fast delivery' },
  { icon: Sparkles, text: 'Premium products' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      const { token, user } = res.data;
      login(user, token);
      toast.success(`Welcome back, ${user.fullName || user.firstName || 'there'}!`);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.error('Google login requires backend OAuth setup');
  };

  const handleFacebookLogin = () => {
    toast.error('Facebook login requires backend OAuth setup');
  };

  return (
    <div className={styles.page}>
      {/* Left - Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>TRENDORA</Link>

          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
              </div>
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className={`${styles.input} ${styles.inputPassword} ${errors.password ? styles.inputError : ''}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <span className={styles.forgotLink} style={{cursor: 'pointer'}}>Forgot password?</span>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialBtn} onClick={handleGoogleLogin} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className={styles.socialBtn} onClick={handleFacebookLogin} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <p className={styles.switchText}>
            Don't have an account? <Link to="/register" className={styles.switchLink}>Create one</Link>
          </p>

          <div className={styles.highlights}>
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className={styles.highlightItem}>
                  <Icon size={14} />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right - Image */}
      <div className={styles.imageSide}>
        <img src={loginImg} alt="Welcome to Trendora" className={styles.heroImage} />
        <div className={styles.imageOverlay} />
        <div className={styles.imageContent}>
          <div className={styles.heroCard}>
            <h2 className={styles.heroTitle}>Discover Premium Shopping</h2>
            <p className={styles.heroDesc}>
              Access your orders, wishlist, and exclusive deals. Your shopping journey continues here.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>340k+</span>
                <span className={styles.heroStatLabel}>Customers</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>12k+</span>
                <span className={styles.heroStatLabel}>Products</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>4.9★</span>
                <span className={styles.heroStatLabel}>Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
