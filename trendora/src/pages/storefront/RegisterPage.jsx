import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import styles from './RegisterPage.module.css';

import regImg from '../../assets/images resouces/(1) Instagram.jfif';

const highlights = [
  { icon: ShieldCheck, text: 'Secure checkout' },
  { icon: Truck, text: 'Fast delivery' },
  { icon: Sparkles, text: 'Premium products' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: 'ROLE_CUSTOMER',
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left - Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>TRENDORA</Link>

          <div className={styles.formHeader}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join Trendora and start shopping today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.nameRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Amara"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  />
                </div>
                {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Kofi"
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  />
                </div>
                {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className={`${styles.input} ${styles.inputPassword} ${errors.password ? styles.inputError : ''}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <div className={styles.terms}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('terms', { required: true })} className={styles.checkbox} />
                <span>I agree to the <Link to="/return-policy" className={styles.termsLink}>Terms of Service</Link> and <Link to="/return-policy" className={styles.termsLink}>Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
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
        <img src={regImg} alt="Join Trendora" className={styles.heroImage} />
        <div className={styles.imageOverlay} />
        <div className={styles.imageContent}>
          <div className={styles.heroCard}>
            <h2 className={styles.heroTitle}>Start Your Shopping Journey</h2>
            <p className={styles.heroDesc}>
              Discover premium products at affordable prices. Join thousands of happy customers across Cameroon.
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
