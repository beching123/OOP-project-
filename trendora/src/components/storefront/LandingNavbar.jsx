import { Link } from 'react-router-dom';
import styles from './LandingNavbar.module.css';

export default function LandingNavbar() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            TRENDORA
          </Link>
        </div>

        <nav className={styles.navLinks}>
          <a href="#about" onClick={scrollTo('about')} className={styles.link}>About</a>
          <a href="#contact" onClick={scrollTo('contact')} className={styles.link}>Contact</a>
          <a href="#return-policy" onClick={scrollTo('return-policy')} className={styles.link}>Return Policy</a>
        </nav>

        <div className={styles.right}>
          <Link to="/register" className={styles.getStartedBtn}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
