import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import useCartStore from '../../stores/cartStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const location = useLocation();
  const hideOnCatalogPage = location.pathname.startsWith('/catalog');

  if (hideOnCatalogPage) {
    return null;
  }

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <div className={styles.left}>
          <button className={styles.menuBtn} aria-label="Menu">
            <Menu size={24} />
          </button>
          <Link to="/home" className={styles.logo}>
            TRENDORA
          </Link>
        </div>

        <nav className={`${styles.navLinks} hide-tablet`}>
          <NavLink to="/home" end className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Home</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Shop</NavLink>
          <NavLink to="/catalog/deals" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Deals</NavLink>
          <NavLink to="/track-order" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Track Order</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Contact</NavLink>
          <NavLink to="/return-policy" className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>Return Policy</NavLink>
        </nav>

        <div className={styles.right}>
          <Link to="/profile" className={styles.iconBtn}>
            <User size={20} />
          </Link>

          <Link to="/cart" className={styles.iconBtn}>
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
