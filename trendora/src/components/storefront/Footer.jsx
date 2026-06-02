import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import styles from './Footer.module.css';

const SOCIAL_LINKS = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/237600000000',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/whatsapp.svg',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/facebook.svg',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/instagram.svg',
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logo}>TRENDORA</Link>
          <p className={styles.desc}>{t('footer.description')}</p>
          <div className={styles.socials}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={styles.socialBtn}
                aria-label={social.name}
                target="_blank"
                rel="noreferrer"
              >
                <img src={social.logoUrl} alt="" className={styles.socialIcon} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.title}>{t('footer.quickLinks')}</h4>
          <Link to="/catalog" className={styles.link}>{t('nav.shop')}</Link>
          <Link to="/about" className={styles.link}>{t('nav.about')}</Link>
          <Link to="/contact" className={styles.link}>{t('nav.contact')}</Link>
          <Link to="/profile" className={styles.link}>{t('nav.profile')}</Link>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.title}>{t('footer.customerService')}</h4>
          <Link to="/track-order" className={styles.link}>{t('nav.trackOrder')}</Link>
          <Link to="/return-policy" className={styles.link}>{t('nav.returnPolicy')}</Link>
          <div className={styles.infoRow}>
            <MapPin size={16} /> <span>Buea, Cameroon</span>
          </div>
          <div className={styles.infoRow}>
            <Phone size={16} /> <span>+237 600 00 00 00</span>
          </div>
          <div className={styles.infoRow}>
            <Mail size={16} /> <span>support@trendora.cm</span>
          </div>
        </div>

        <div className={styles.newsletterCol}>
          <h4 className={styles.title}>{t('footer.newsletter')}</h4>
          <p className={styles.desc}>{t('footer.newsletterDesc')}</p>
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed!'); }}>
            <input type="email" placeholder={t('footer.emailPlaceholder')} className={styles.input} required />
            <button type="submit" className={styles.subBtn}>{t('footer.subscribe')}</button>
          </form>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TRENDORA. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
