import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Users, Box, Star, CheckCircle, Globe, Truck, Sparkles, Package, Clock, Heart } from 'lucide-react';
import heroImg from '../../assets/images resouces/Businesses Trust SDH.webp';
import customer1 from '../../assets/images resouces/customer1.jpg';
import customer2 from '../../assets/images resouces/customer2.jpg';
import customer3 from '../../assets/images resouces/customer3.jpg';
import customer4 from '../../assets/images resouces/customer4.jpg';
import customer5 from '../../assets/images resouces/customer5.jpg';
import customer6 from '../../assets/images resouces/customer6.jpg';
import customer7 from '../../assets/images resouces/customer7.jpg';
import styles from './AboutPage.module.css';

const tabItems = [
  {
    id: 'mission',
    label: 'Our Mission',
    content:
      'We curate quality products at affordable prices to make shopping effortless, practical, and accessible. Every item is chosen to bring modern living to more people without compromising value.',
  },
  {
    id: 'vision',
    label: 'Our Vision',
    content:
      'We are building a global shopping destination that serves over 1 million customers across 80 countries by 2030, powered by sustainable logistics, trusted partners, and effortless discovery.',
  },
  {
    id: 'goal',
    label: 'Our Goal',
    content:
      'To become the most trusted multi-category marketplace with faster delivery, smarter product discovery, and real human support that customers rely on every time they shop.',
  },
];

const processSteps = [
  {
    title: 'Browse & Discover',
    description: 'Search 12,000+ products or explore curated collections to find exactly what inspires you.',
    icon: Users,
  },
  {
    title: 'Save & Compare',
    description: 'Wishlist favourites, compare options, and read reviews before making the perfect choice.',
    icon: Sparkles,
  },
  {
    title: 'Order Securely',
    description: 'Fast checkout with multiple payment options and SSL protection for every transaction.',
    icon: Package,
  },
  {
    title: 'Fast Delivery',
    description: 'Same or next-day dispatch with live order tracking until your package arrives.',
    icon: Truck,
  },
];

const founders = [
  'Beching Rexzy Bate',
  'Nche Emmanuel',
  'Tsafack Kamfack Andy Pedro',
  'Obi Theomark Enow-Ayuk',
  'Ngum Vianni Khekha',
  'Anyi Faith Njang',
  'Mboa Nehemiah',
  'Ebongo Ngoy Esaie',
].map((name) => ({
  name,
  role: 'Founding Member',
  note: 'One of the original people behind the OOP project that became Trendora.',
}));

const getInitials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const oldTestimonials = [
  {
    name: 'Ezekiel Mbui',
    role: 'Freelance Stylist, Douala',
    quote: 'Trendora makes shopping easy, fast, and beautiful. The customer care team went above and beyond.',
  },
  {
    name: 'Theresa Fobi',
    role: 'Entrepreneur, Buea',
    quote: 'I trust Trendora for quality products and speedy delivery. Every order feels premium.',
  },
  {
    name: 'Esther Njang',
    role: 'Designer, Yaoundé',
    quote: 'Their curated selection helps me discover new pieces without the noise. Love the experience.',
  },
];

const customerSlides = [
  { src: customer1, alt: 'Anita Ndom', name: 'Anita Ndom', role: 'Verified shopper', quote: 'Trusted quality at an affordable price.' },
  { src: customer2, alt: 'Daniel Mbarga', name: 'Daniel Mbarga', role: 'Delivery agent', quote: 'Shopping felt easy, fast, and reliable.' },
  { src: customer3, alt: 'Prisca Mbi', name: 'Prisca Mbi', role: 'Verified shopper', quote: 'Exactly the value I wanted.' },
  { src: customer4, alt: 'Nelly Fobang', name: 'Nelly Fobang', role: 'Verified shopper', quote: 'Great products, great price.' },
  { src: customer5, alt: 'Kene Uche', name: 'Kene Uche', role: 'Verified shopper', quote: 'A smooth and premium experience.' },
  { src: customer6, alt: 'Paul Tambo', name: 'Paul Tambo', role: 'Delivery agent', quote: 'I keep coming back for the deals.' },
  { src: customer7, alt: 'Ruth Asong', name: 'Ruth Asong', role: 'Verified shopper', quote: 'Quality that fits the budget.' },
];

const testimonials = [
  {
    name: 'Ezekiel Mbui',
    role: 'Freelance Stylist, Douala',
    quote: 'Trendora makes shopping easy, fast, and beautiful. The customer care team went above and beyond.',
    image: customer1,
    alt: 'Ezekiel Mbui',
  },
  {
    name: 'Theresa Fobi',
    role: 'Entrepreneur, Buea',
    quote: 'I trust Trendora for quality products and speedy delivery. Every order feels premium.',
    image: customer3,
    alt: 'Theresa Fobi',
  },
  {
    name: 'Esther Njang',
    role: 'Designer, Yaoundé',
    quote: 'Their curated selection helps me discover new pieces without the noise. Love the experience.',
    image: customer7,
    alt: 'Esther Njang',
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');
  const [activeSlide, setActiveSlide] = useState(0);
  const missionSectionRef = useRef(null);
  const currentTab = tabItems.find((item) => item.id === activeTab) || tabItems[0];

  const scrollToMission = () => {
    missionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % customerSlides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <img src={heroImg} alt="Trendora About Hero" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              We Built Trendora for <span className={styles.heroTitleEm}>People Like You</span>.
            </h1>
            <p className={styles.heroIntro}>
              Trendora is designed for shoppers who want premium choices, effortless discovery, and the kind of confidence that comes from trusted quality and local care.
            </p>
            <div className={styles.metricRow}>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>
                  <Users size={18} />
                </div>
                <div className={styles.metricText}>
                  <span className={styles.metricValue}>340k+</span>
                  <span className={styles.metricLabel}>Customers</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>
                  <Box size={18} />
                </div>
                <div className={styles.metricText}>
                  <span className={styles.metricValue}>12k+</span>
                  <span className={styles.metricLabel}>Products</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>
                  <Star size={18} />
                </div>
                <div className={styles.metricText}>
                  <span className={styles.metricValue}>4.9★</span>
                  <span className={styles.metricLabel}>Average Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroPanel}>
              <div className={styles.heroPanelContent}>
                <div className={styles.heroPanelTitle}>A premium marketplace built to feel modern, reliable and beautifully local.</div>
                <div className={styles.heroPanelText}>
                  The right products, hand-selected for your life, presented in a luxurious experience that feels effortless and trusted.
                </div>
              </div>
            </div>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeIcon}>
                <ShieldCheck size={20} />
              </div>
              <div className={styles.heroBadgeText}>
                <span className={styles.heroBadgeTitle}>Trusted Store</span>
                <span className={styles.heroBadgeSubtitle}>Since 2019</span>
              </div>
            </div>
          </div>
          <div className={styles.promiseCtaRow}>
            <Link to="/return-policy" className={styles.promiseCtaLink}>
              View Return Policy
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.aboutSplit}>
        <div className={`container ${styles.aboutSplitGrid}`}>
          <div className={styles.aboutMedia}>
            <div className={styles.aboutMediaFrame}>
              <img
                src="https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="Trendora premium selection"
                className={styles.aboutMediaGraphic}
              />
              <div className={styles.aboutMediaOverlay} />
            </div>
            <div className={styles.aboutFloatingCard}>
              <div className={styles.aboutFloatingNumber}>7+</div>
              <div className={styles.aboutFloatingLabel}>Years of Excellence</div>
            </div>
          </div>

          <div className={styles.aboutContent}>
            <span className={styles.pillTag}>Our Story</span>
            <h2 className={styles.aboutHeading}>
              One of the Smartest Ways to Shop <em>Everything</em> You Love
            </h2>
            <p className={styles.aboutParagraph}>
              Trendora combines premium curation with local insight to bring shoppers a beautifully simple way to discover products they truly want. We believe in quality, reliability, and effortless style.
            </p>
            <p className={styles.aboutParagraph}>
              From our home in Cameroon to customers across the region, we focus on smart selection, fast fulfillment, and unmatched customer care.
            </p>
            <div className={styles.checklistGrid}>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <CheckCircle size={16} />
                </div>
                <div className={styles.checkLabel}>Quality-verified products</div>
              </div>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <Truck size={16} />
                </div>
                <div className={styles.checkLabel}>Same-day dispatch available</div>
              </div>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <ShieldCheck size={16} />
                </div>
                <div className={styles.checkLabel}>30-day hassle-free returns</div>
              </div>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <Globe size={16} />
                </div>
                <div className={styles.checkLabel}>Eco-friendly packaging</div>
              </div>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <Users size={16} />
                </div>
                <div className={styles.checkLabel}>Trusted by 340k shoppers</div>
              </div>
              <div className={styles.checklistItem}>
                <div className={styles.checkIcon}>
                  <Box size={16} />
                </div>
                <div className={styles.checkLabel}>Ships to 38 countries</div>
              </div>
            </div>
            <div className={styles.aboutButtons}>
              <Link className={styles.btnPrimary} to="/catalog">
                Shop Now <ArrowRight size={18} />
              </Link>
              <button className={styles.btnSecondary} type="button" onClick={scrollToMission}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsStrip}>
        <div className={`container ${styles.statsInner}`}>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>
              <Clock size={20} />
            </div>
            <div>
              <div className={styles.statValue}>7+</div>
              <div className={styles.statLabel}>Years in Business</div>
            </div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>
              <Box size={20} />
            </div>
            <div>
              <div className={styles.statValue}>12k+</div>
              <div className={styles.statLabel}>Products Listed</div>
            </div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>
              <Star size={20} />
            </div>
            <div>
              <div className={styles.statValue}>340k</div>
              <div className={styles.statLabel}>Happy Customers</div>
            </div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>
              <Globe size={20} />
            </div>
            <div>
              <div className={styles.statValue}>38</div>
              <div className={styles.statLabel}>Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tabSection} ref={missionSectionRef}>
        <div className={`container ${styles.tabInner}`}>
          <div className={styles.tabLeft}>
            <span className={styles.pillTag}>About Mission</span>
            <h2 className={styles.tabHeading}>
              Our Main Goal to Delight <em>Every Single Customer</em>
            </h2>
            <div className={styles.tabButtons}>
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={styles.tabContentCard}>
              <p className={styles.tabContentText}>{currentTab.content}</p>
            </div>
          </div>
          <div className={styles.tabRight}>
            <div className={styles.tabRightImage}>
              <div className={styles.tabRightSlides}>
                {customerSlides.map((slide, index) => (
                  <img
                    key={slide.alt}
                    src={slide.src}
                    alt={slide.alt}
                    className={`${styles.tabRightSlideImage} ${index === activeSlide ? styles.tabRightSlideImageActive : ''}`}
                  />
                ))}
              </div>
              <div className={styles.tabRightImageOverlay} />
              <div className={styles.tabRightImageContent}>
                <div className={styles.tabRightImageTitle}>{customerSlides[activeSlide].name}</div>
                <div className={styles.tabRightImageRole}>{customerSlides[activeSlide].role}</div>
                <div className={styles.tabRightImageText}>{customerSlides[activeSlide].quote}</div>
                <div className={styles.tabRightSlideDots}>
                  {customerSlides.map((slide, index) => (
                    <button
                      key={slide.alt}
                      type="button"
                      className={`${styles.tabRightSlideDot} ${index === activeSlide ? styles.tabRightSlideDotActive : ''}`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Show slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.tabRightBadge}>
              <span className={styles.tabRightBadgeLabel}>Est. 2019</span>
              <span className={styles.tabRightBadgeSub}>Yaoundé → Global</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processHeader}>
          <span className={styles.pillTag}>How It Works</span>
          <h2 className={styles.processTitle}>
            Our <em>Working Process</em>
          </h2>
          <p className={styles.processSubtitle}>
            Simple, transparent steps from discovery to delivery, designed for a premium shopping journey.
          </p>
        </div>
        <div className={`container ${styles.processSteps}`}>
          <div className={styles.processLine} aria-hidden="true" />
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepCircle}>
                  <Icon size={28} className={styles.stepIcon} />
                </div>
                <div className={styles.stepBadge}>{index + 1}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.foundersSection}>
        <div className={`container ${styles.foundersLayout}`}>
          <div className={styles.foundersIntro}>
            <span className={styles.pillTag}>Our Founders</span>
            <h2 className={styles.foundersTitle}>
              The Original <em>Project Team</em> Behind Trendora
            </h2>
            <p className={styles.foundersSubtitle}>
              Trendora started as an OOP project, and this section now honors the founding members who helped shape the idea, the code, and the early direction of the brand.
            </p>
            <div className={styles.foundersCallout}>
              <strong>8 founding members</strong>
              <span>Built together, learned together, and launched the idea as one team.</span>
            </div>
          </div>

          <div className={styles.foundersGrid}>
            {founders.map((founder, index) => (
              <article key={founder.name} className={styles.founderCard}>
                <div className={styles.founderTop}>
                  <div className={styles.founderNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <div className={styles.founderAvatar}>{getInitials(founder.name)}</div>
                </div>
                <div className={styles.founderBody}>
                  <p className={styles.founderRole}>{founder.role}</p>
                  <h3 className={styles.founderName}>{founder.name}</h3>
                  <p className={styles.founderNote}>{founder.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <div className={styles.testimonialHeader}>
          <span className={styles.pillTag}>What People Say</span>
          <h2 className={styles.testimonialTitle}>
            Trusted by <em>Thousands</em> of Happy Shoppers
          </h2>
          <p className={styles.testimonialSubtitle}>
            Real feedback from real customers who appreciate the premium service, quality products, and fast delivery.
          </p>
        </div>
        <div className={`container ${styles.testimonialGrid}`}>
          {testimonials.map((item) => (
            <div key={item.name} className={styles.testimonialCard}>
              <div className={styles.quoteBlock}>&ldquo;{item.quote}&rdquo;</div>
              <div className={styles.testimonialFooter}>
                <div className={styles.avatarCircle}>
                  <img src={item.image} alt={item.alt} className={styles.avatarImage} />
                </div>
                <div className={styles.reviewMeta}>
                  <div className={styles.reviewName}>{item.name}</div>
                  <div className={styles.reviewRole}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.promiseStrip}>
        <div className={`container ${styles.promiseInner}`}>
          <div>
            <h2 className={styles.promiseHeading}>
              Our Promise to <em>Every</em> Customer
            </h2>
            <p className={styles.promiseSubtitle}>
              We stand behind every order with fast delivery, easy returns, and real support so you can shop with confidence.
            </p>
            <Link to="/return-policy" className={styles.promiseCtaLink}>
              View Return Policy
            </Link>
          </div>
          <div className={styles.promiseGrid}>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>
                <Truck size={20} />
              </div>
              <div>
                <p className={styles.promiseCardTitle}>Fast & Free Delivery</p>
                <p className={styles.promiseCardText}>Free shipping on orders over 50,000 XAF, delivered within 3 business days.</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className={styles.promiseCardTitle}>Hassle-Free Returns</p>
                <p className={styles.promiseCardText}>30-day return window with a full refund and no questions asked.</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>
                <Heart size={20} />
              </div>
              <div>
                <p className={styles.promiseCardTitle}>Real Human Support</p>
                <p className={styles.promiseCardText}>No bots — a real team member responds to every message, 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <span className={styles.ctaTag}>Ready to explore?</span>
            <h2 className={styles.ctaHeading}>
              Now You Know Who We Are. <em>Come See What We&apos;ve Built.</em>
            </h2>
            <p className={styles.ctaText}>
              Discover curated styles, top-rated products, and a premium shopping experience built for modern customers.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/catalog" className={styles.ctaPrimary}>
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className={styles.ctaSecondary}>
              Contact Us
            </Link>
            <div className={styles.ctaNote}>
              Free shipping on your first order · No account needed
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

