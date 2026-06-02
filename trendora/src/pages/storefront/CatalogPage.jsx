import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  Bike,
  Clock3,
  FileText,
  Heart,
  Home,
  Info,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  SunMoon,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { mockProducts } from '../../data/products';
import { FLASH_DEALS } from '../../data/flashDeals';
import { mockCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { getShippingCost } from '../../utils/constants';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { API_BASE_URL } from '../../utils/constants';

import heroDeals from '../../assets/images resouces/electronics/phone.jpeg';
import heroHome from '../../assets/images resouces/house furnitures/chair5.jpeg';
import heroBrowse from '../../assets/images resouces/clothe/women ware/clothe1.jpeg';
import useCartStore from '../../stores/cartStore';
import useThemeStore from '../../stores/themeStore';
import styles from './CatalogPage.module.css';

const HERO_SLIDES = [
  {
    id: 'hero-1',
    title: 'Luxury picks for everyday living',
    subtitle: 'Shop premium-style products at prices that still feel smart.',
    cta: 'Explore Deals',
    link: '/catalog/deals',
    image: heroDeals,
  },
  {
    id: 'hero-2',
    title: 'Upgrade your home with confidence',
    subtitle: 'Discover practical essentials that look good and work hard.',
    cta: 'Shop Home',
    link: '/catalog/home-living',
    image: heroHome,
  },
  {
    id: 'hero-3',
    title: 'Fresh finds for every style',
    subtitle: 'From fashion to beauty to tech, the best picks stay in one place.',
    cta: 'Browse Catalog',
    link: '/catalog',
    image: heroBrowse,
  },
];

const PROMO_CARDS = [
  {
    id: 'promo-1',
    title: 'Fast delivery',
    subtitle: 'Straightforward shipping and quick fulfillment.',
    icon: Truck,
  },
  {
    id: 'promo-2',
    title: 'Secure checkout',
    subtitle: 'Safe payments and smooth order handling.',
    icon: ShoppingBag,
  },
  {
    id: 'promo-3',
    title: 'Fresh deals',
    subtitle: 'Hand-picked discounts on top products.',
    icon: BadgePercent,
  },
];

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/catalog', label: 'Shop', icon: ShoppingBag, end: true },
  { to: '/catalog/deals', label: 'Deals', icon: BadgePercent },
  { to: '/track-order', label: 'Track Order', icon: Clock3 },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Phone },
  { to: '/return-policy', label: 'Policies', icon: FileText },
];

const CATEGORY_ICONS = {
  electronics: Package,
  fashion: Shirt,
  'home-living': Home,
  'beauty-health': Sparkles,
  sports: Bike,
};

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Mobile Money', 'Orange Money'];

const PROMO_CODE = 'TRENDORA10';
const DEAL_ACCESS_KEY = 'trendora-deal-access';

const COLOR_PALETTES = {
  electronics: ['#0f172a', '#1d4ed8', '#22c55e', '#f97316'],
  fashion: ['#7c3aed', '#ef4444', '#0f766e', '#f59e0b'],
  'home-living': ['#14532d', '#0f766e', '#f97316', '#6b7280'],
  'beauty-health': ['#db2777', '#ec4899', '#c084fc', '#f59e0b'],
  sports: ['#d97706', '#84cc16', '#06b6d4', '#ef4444'],
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getSavings = useCartStore((state) => state.getSavings);
  const getDiscountedSubtotal = useCartStore((state) => state.getDiscountedSubtotal);
  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const savings = getSavings();
  const discountedSubtotal = getDiscountedSubtotal();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const theme = useThemeStore((state) => state.theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('popular');
  const [heroIndex, setHeroIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cartCollapsed, setCartCollapsed] = useState(false);
  const [dealEmail, setDealEmail] = useState('');
  const [dealAccess, setDealAccess] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DEAL_ACCESS_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [dealEmailMessage, setDealEmailMessage] = useState('');
  const [dealCodeInput, setDealCodeInput] = useState('');
  const [dealCodeMessage, setDealCodeMessage] = useState('');
  const [dealVerified, setDealVerified] = useState(false);
  const [pendingDealProduct, setPendingDealProduct] = useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('trendora-recently-viewed') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [apiProducts, setApiProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const dealAccessRef = useRef(null);
  const dealEmailInputRef = useRef(null);

  // Fetch products and categories from API, fall back to mock data
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.allSettled([
          productService.getProducts({ page: 0, size: 100 }),
          categoryService.getCategories(),
        ]);

        if (productsRes.status === 'fulfilled') {
          const data = productsRes.value.data;
          const list = Array.isArray(data) ? data : (data.content || []);
          const mapped = list.map((p) => {
            const rawImg = p.imageUrl || p.image || '';
            const resolvedImg = rawImg.startsWith('/api/')
              ? API_BASE_URL.replace('/api', '') + rawImg
              : rawImg || 'https://placehold.co/400x400?text=No+Image';
            return {
              id: `api-${p.id}`,
              apiId: p.id,
              name: p.name,
              description: p.description || '',
              subtitle: p.description || '',
              price: p.price,
              salePrice: p.salePrice || null,
              category: p.categoryName || p.category?.name || p.categoryId || 'other',
              images: [resolvedImg],
              rating: p.rating || 4.5,
              reviews: p.reviews || 0,
              stock: p.stockQuantity || p.stock || 0,
              inStock: (p.stockQuantity || p.stock || 0) > 0,
            };
          });
          setApiProducts(mapped);
        }

        if (categoriesRes.status === 'fulfilled') {
          const catData = categoriesRes.value.data;
          const catList = Array.isArray(catData) ? catData : (catData.content || []);
          const mappedCats = catList.map((c) => ({
            id: c.name?.toLowerCase().replace(/\s+/g, '-') || `cat-${c.id}`,
            name: c.name,
            icon: c.icon || 'Package',
            description: c.description || '',
            image: c.image || null,
          }));
          if (mappedCats.length > 0) setApiCategories(mappedCats);
        }
      } catch {
        // API not available, use mock data
      }
    };
    fetchApiData();
  }, []);

  // Use API products merged with mock data — mock products provide rich local images,
  // API products supplement with any real data from the backend
  const allProducts = (() => {
    if (apiProducts.length === 0) return mockProducts;
    const apiWithImages = apiProducts.filter(
      (p) => p.images[0] && !p.images[0].includes('placehold')
    );
    if (apiWithImages.length > 0) {
      const apiNames = new Set(apiWithImages.map((p) => p.name.toLowerCase()));
      const extraMock = mockProducts.filter((p) => !apiNames.has(p.name.toLowerCase()));
      return [...apiWithImages, ...extraMock];
    }
    return mockProducts;
  })();
  const allCategories = apiCategories.length > 0 ? apiCategories : mockCategories;

  const activeCategory = category && category !== 'deals' ? allCategories.find((item) => item.id === category) : null;
  const isDealsView = category === 'deals';

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const categoryFilter = category && category !== 'deals' ? category : null;

    let products = isDealsView ? [...FLASH_DEALS] : [...allProducts];

    if (categoryFilter) {
      products = products.filter((product) => product.category === categoryFilter);
    }

    if (query) {
      products = products.filter((product) => {
        const haystack = `${product.name} ${product.description || product.subtitle || ''} ${product.category}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    if (isDealsView) {
      if (activeSort === 'price-low') {
        products.sort((a, b) => a.salePrice - b.salePrice);
      } else if (activeSort === 'price-high') {
        products.sort((a, b) => b.salePrice - a.salePrice);
      } else {
        products.sort((a, b) => b.salePrice - a.salePrice);
      }
      return products;
    }

    if (activeSort === 'popular') {
      products.sort((a, b) => b.reviews - a.reviews);
    } else if (activeSort === 'newest') {
      products.sort((a, b) => allProducts.indexOf(b) - allProducts.indexOf(a));
    } else if (activeSort === 'price-low') {
      products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (activeSort === 'price-high') {
      products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (activeSort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [activeSort, category, isDealsView, searchQuery]);

  const headlineProducts = useMemo(
    () => (filteredProducts.some((product) => product.salePrice)
      ? filteredProducts.filter((product) => product.salePrice).slice(0, 4)
      : filteredProducts.slice(0, 4)),
    [filteredProducts]
  );
  const categoryShowcaseProducts = useMemo(() => {
    if (activeCategory?.id === 'electronics') {
      const showcaseIds = ['p-8', 'p-11', 'p-18', 'p-20', 'p-3', 'p-9', 'p-10', 'p-12', 'p-21', 'p-22', 'p-23', 'p-24', 'p-25'];
      return showcaseIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter(Boolean);
    }

    if (activeCategory?.id === 'fashion') {
      return {
        male: ['p-2', 'p-15', 'p-16', 'p-26', 'p-27', 'p-28', 'p-29', 'p-30', 'p-31', 'p-32', 'p-33', 'p-34', 'p-35', 'p-36', 'p-37', 'p-38', 'p-39']
          .map((id) => allProducts.find((product) => product.id === id))
          .filter(Boolean),
        female: ['p-4', 'p-14', 'p-17', 'p-40', 'p-41', 'p-42', 'p-43', 'p-44', 'p-45', 'p-46', 'p-47', 'p-48', 'p-49', 'p-50']
          .map((id) => allProducts.find((product) => product.id === id))
          .filter(Boolean),
      };
    }

    if (activeCategory?.id === 'home-living') {
      const showcaseIds = ['p-59', 'p-53', 'p-54', 'p-55', 'p-56', 'p-57', 'p-58', 'p-8', 'p-11'];
      return showcaseIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter(Boolean);
    }

    if (activeCategory?.id === 'beauty-health') {
      const showcaseIds = ['p-6', 'p-60', 'p-61', 'p-62', 'p-63', 'p-64', 'p-65'];
      return showcaseIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter(Boolean);
    }

    if (activeCategory?.id === 'sports') {
      return ['p-7']
        .map((id) => allProducts.find((product) => product.id === id))
        .filter(Boolean);
    }

    return allProducts.filter((product) => product.category === 'fashion').slice(0, 4);
  }, [activeCategory?.id]);

  const showcaseTitle =
    activeCategory?.id === 'electronics'
      ? 'More Electronics'
      : activeCategory?.id === 'home-living'
        ? 'Home & Living Picks'
        : activeCategory?.id === 'beauty-health'
          ? 'Beauty & Health Picks'
          : activeCategory?.id === 'sports'
            ? 'Sports Pick'
          : 'More to Love';
  const showcaseSubtitle =
    activeCategory?.id === 'electronics'
      ? 'Extra electronics picks with only the items that fit the category.'
      : activeCategory?.id === 'home-living'
        ? 'Furniture and kitchen pieces chosen from the home and living collection.'
        : activeCategory?.id === 'beauty-health'
          ? 'Perfumes and oils chosen from the beauty and health collection.'
          : activeCategory?.id === 'sports'
            ? 'Just the sport bike for now, kept clean and focused.'
        : 'Separated into men and women so the fashion picks stay clean and easy to browse.';
  const cartRecommendations = useMemo(
    () => allProducts.filter((product) => !cartItems.some((item) => item.id === product.id)).sort((a, b) => b.rating - a.rating).slice(0, 2),
    [cartItems]
  );
  const recentlyViewed = useMemo(
    () => recentlyViewedIds.map((id) => allProducts.find((product) => product.id === id)).filter(Boolean).slice(0, 6),
    [recentlyViewedIds]
  );

  const appliedDiscount = discountedSubtotal && promoCode.trim().toUpperCase() === PROMO_CODE ? discountedSubtotal * (discountPercent / 100) : 0;
  const shippingCost = getShippingCost('', '', discountedSubtotal - appliedDiscount);
  const total = Math.max(0, discountedSubtotal - appliedDiscount + shippingCost);
  const dealProducts = useMemo(() => {
    const products = [...FLASH_DEALS];

    if (activeSort === 'price-low') {
      return products.sort((a, b) => a.salePrice - b.salePrice);
    }

    if (activeSort === 'price-high') {
      return products.sort((a, b) => b.salePrice - a.salePrice);
    }

    return products.sort((a, b) => b.salePrice - a.salePrice);
  }, [activeSort]);

  const saveRecentlyViewed = (productId) => {
    const nextIds = [productId, ...recentlyViewedIds.filter((id) => id !== productId)].slice(0, 8);
    setRecentlyViewedIds(nextIds);
    localStorage.setItem('trendora-recently-viewed', JSON.stringify(nextIds));
  };

  const toggleWishlist = (productId) => {
    setWishlisted((current) => (
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    ));
  };

  const handleAddItem = (product) => {
    addItem(product);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === PROMO_CODE) {
      setDiscountPercent(10);
      setPromoMessage('10% off applied.');
      return;
    }

    setDiscountPercent(0);
    setPromoMessage('Promo code not recognized.');
  };

  const handleRequestDealCode = () => {
    if (!dealEmail.trim()) {
      setDealEmailMessage('Please enter your email first.');
      return;
    }

    const generatedCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    const nextDealAccess = {
      email: dealEmail.trim().toLowerCase(),
      code: generatedCode,
    };

    setDealAccess(nextDealAccess);
    setDealEmailMessage(`Code sent to ${nextDealAccess.email}.`);
    setDealCodeMessage('');
    setDealVerified(false);
    localStorage.setItem(DEAL_ACCESS_KEY, JSON.stringify(nextDealAccess));
  };

  const handleVerifyDealCode = () => {
    if (!dealAccess?.code) {
      setDealCodeMessage('Request a code first.');
      return;
    }

    if (dealCodeInput.trim() === dealAccess.code) {
      setDealVerified(true);
      setDealCodeMessage('Deal code verified successfully.');
      if (pendingDealProduct) {
        addItem(pendingDealProduct);
        setPendingDealProduct(null);
      }
      return;
    }

    setDealVerified(false);
    setDealCodeMessage('That code does not match.');
  };

  const handleProtectedDealAdd = (deal) => {
    if (!dealVerified) {
      setPendingDealProduct(deal);
      setDealEmailMessage('Enter your email above, request a code, then verify it to unlock the deal.');
      dealAccessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        dealEmailInputRef.current?.focus();
      }, 250);
      return;
    }

    addItem(deal);
  };

  const currentHero = HERO_SLIDES[heroIndex];

  return (
    <div className={`${styles.catalogShell} ${cartCollapsed ? styles.catalogShellCollapsed : ''}`}>
      <aside className={styles.leftSidebar}>
        <div className={styles.sidebarInner}>
          <Link to="/" className={styles.sidebarLogo}>
            TRENDORA
          </Link>

          <nav className={styles.sideNav}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `${styles.sideLink} ${isActive ? styles.sideLinkActive : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.sidebarPromo}>
            <p className={styles.sidebarPromoEyebrow}>Flash deals</p>
            <h3 className={styles.sidebarPromoTitle}>Save on trending picks</h3>
            <p className={styles.sidebarPromoText}>Browse limited-time markdowns before they're gone.</p>
            <Link to="/catalog/deals" className={styles.sidebarPromoButton}>
              View deals <ArrowRight size={16} />
            </Link>
          </div>

          <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
            <SunMoon size={18} />
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>

      <main className={styles.centerColumn}>
        <div className={styles.searchHeader}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, categories, and deals..."
              className={styles.searchInput}
            />
          </div>

          <button
            type="button"
            className={styles.cartToggleButton}
            onClick={() => setCartCollapsed((current) => !current)}
            aria-label={cartCollapsed ? 'Open cart' : 'Close cart'}
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </button>
        </div>

        <div className={styles.sortBar}>
          {[
            { id: 'popular', label: 'Popular' },
            { id: 'newest', label: 'Newest' },
            { id: 'price-low', label: 'Price: Low' },
            { id: 'price-high', label: 'Price: High' },
            { id: 'rating', label: 'Top Rated' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.sortChip} ${activeSort === option.id ? styles.sortChipActive : ''}`}
              onClick={() => setActiveSort(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isDealsView ? (
          <>
            <section className={styles.dealAccessSection} ref={dealAccessRef}>
              <div className={styles.dealAccessCard}>
                <div>
                  <p className={styles.dealAccessEyebrow}>Flash deals</p>
                  <h1 className={styles.dealAccessTitle}>Claim your deal code</h1>
                  <p className={styles.dealAccessText}>
                    Enter your email to receive a unique code for flash deal access.
                  </p>
                </div>
                <div className={styles.dealAccessForm}>
                  <input
                    type="email"
                    value={dealEmail}
                    onChange={(event) => setDealEmail(event.target.value)}
                    placeholder="Enter your email"
                    ref={dealEmailInputRef}
                    className={styles.dealAccessInput}
                  />
                  <button type="button" className={styles.dealAccessButton} onClick={handleRequestDealCode}>
                    Send code
                  </button>
                </div>
                {dealEmailMessage && <p className={styles.dealAccessMessage}>{dealEmailMessage}</p>}
                {dealAccess && (
                  <div className={styles.dealCodePanel}>
                    <div>
                      <p className={styles.dealCodeLabel}>Your code</p>
                      <strong className={styles.dealCodeValue}>{dealAccess.code}</strong>
                    </div>
                    <div className={styles.dealCodeVerifier}>
                      <input
                        type="text"
                        value={dealCodeInput}
                        onChange={(event) => setDealCodeInput(event.target.value)}
                        placeholder="Enter code at payment"
                        className={styles.dealAccessInput}
                      />
                      <button type="button" className={styles.dealAccessButton} onClick={handleVerifyDealCode}>
                        Verify
                      </button>
                    </div>
                    {dealCodeMessage && <p className={styles.dealAccessMessage}>{dealCodeMessage}</p>}
                  </div>
                )}
              </div>
            </section>

            <section className={styles.dealGridSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Today's deals</h2>
                  <p className={styles.sectionSubtitle}>Browse our flash offers</p>
                </div>
                {dealVerified && <div className={styles.dealVerifiedPill}>Code verified</div>}
              </div>

              <div className={styles.dealGrid}>
                {dealProducts.map((deal) => {
                  const discount = Math.round(((deal.price - deal.salePrice) / deal.price) * 100);
                  return (
                    <article key={deal.id} className={styles.dealCard}>
                      <div className={styles.dealMedia}>
                        <img src={deal.image} alt={deal.name} className={styles.dealImage} />
                        <span className={styles.dealBadge}>{deal.badge}</span>
                      </div>
                      <div className={styles.dealBody}>
                        <p className={styles.dealCategory}>{deal.category}</p>
                        <h3 className={styles.dealTitle}>{deal.name}</h3>
                        <p className={styles.dealText}>{deal.subtitle}</p>
                        <div className={styles.flashDealPriceStack}>
                          <div className={styles.flashDealPriceRow}>
                            <span className={styles.flashDealPriceLabel}>Deal price</span>
                            <span className={styles.flashDealSale}>{formatCurrency(deal.salePrice)}</span>
                          </div>
                          <div className={styles.flashDealPriceRow}>
                            <span className={styles.flashDealPriceLabel}>Was</span>
                            <span className={styles.flashDealOld}>{formatCurrency(deal.price)}</span>
                          </div>
                        </div>
                        <div className={styles.flashDealFooter}>
                          <span className={styles.flashDealDiscount}>{discount}% off</span>
                          <button type="button" className={styles.flashDealCartBtn} onClick={() => handleProtectedDealAdd(deal)}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
        <section className={styles.heroCard}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{isDealsView ? 'Deals' : activeCategory?.name || 'Curated Catalog'}</p>
            <h1 className={styles.heroTitle}>{currentHero.title}</h1>
            <p className={styles.heroSubtitle}>{currentHero.subtitle}</p>
            <div className={styles.heroActions}>
              <Link to={currentHero.link} className={styles.primaryButton}>
                {currentHero.cta} <ArrowRight size={16} />
              </Link>
              <Link to="/cart" className={styles.secondaryButton}>
                View cart ({itemCount})
              </Link>
            </div>
          </div>

          <div className={styles.heroVisualWrap}>
            <img src={currentHero.image || 'https://placehold.co/600x400?text=Trendora'} alt={currentHero.title} className={styles.heroVisual} />
          </div>

          <div className={styles.heroDots}>
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`${styles.heroDot} ${index === heroIndex ? styles.heroDotActive : ''}`}
                onClick={() => setHeroIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className={styles.categoryRail}>
          {allCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Package;
            return (
              <Link
                key={cat.id}
                to={`/catalog/${cat.id}`}
                className={`${styles.categoryChip} ${category === cat.id ? styles.categoryChipActive : ''}`}
              >
                <Icon size={20} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </section>

        <section className={styles.promoGrid}>
          {PROMO_CARDS.map((promo) => (
            <article key={promo.id} className={styles.promoCard}>
              <div className={styles.promoIcon}>
                <promo.icon size={24} />
              </div>
              <div>
                <h3 className={styles.promoTitle}>{promo.title}</h3>
                <p className={styles.promoText}>{promo.subtitle}</p>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Trending now</h2>
              <p className={styles.sectionSubtitle}>Popular picks</p>
            </div>
            <Link to="/catalog" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {headlineProducts.map((product) => {
              const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
              return (
                <article key={product.id} className={styles.productCard}>
                  <Link
                    to={`/product/${product.id}`}
                    className={styles.productImageWrap}
                    onClick={() => saveRecentlyViewed(product.id)}
                  >
                    <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                    {product.salePrice && <span className={styles.discountBadge}>{discount}% off</span>}
                    <button
                      type="button"
                      className={`${styles.wishlistBtn} ${wishlisted.includes(product.id) ? styles.wishlistBtnActive : ''}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={wishlisted.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </Link>

                  <div className={styles.productBody}>
                    <Link to={`/product/${product.id}`} className={styles.productName} onClick={() => saveRecentlyViewed(product.id)}>
                      {product.name}
                    </Link>
                    <div className={styles.priceRow}>
                      <span className={styles.currentPrice}>{formatCurrency(product.salePrice || product.price)}</span>
                      {product.salePrice && <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>}
                    </div>
                    <div className={styles.ratingRow}>
                      <span className={styles.ratingPill}>
                        <Star size={12} fill="currentColor" stroke="none" />
                        {product.rating}
                      </span>
                      <span className={styles.reviewCount}>{product.reviews} reviews</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{showcaseTitle}</h2>
              <p className={styles.sectionSubtitle}>{showcaseSubtitle}</p>
            </div>
            <Link to="/catalog" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {activeCategory?.id === 'fashion' ? (
            <div className={styles.fashionShowcase}>
              {[
                { key: 'male', title: 'Male Wear', subtitle: 'Clean picks for men, shoes, and caps.', products: categoryShowcaseProducts.male },
                { key: 'female', title: 'Female Wear', subtitle: "Fresh women's looks and everyday style.", products: categoryShowcaseProducts.female },
              ].map((group) => (
                <div key={group.key} className={styles.showcaseGroup}>
                  <div className={styles.showcaseGroupHeader}>
                    <div>
                      <h3 className={styles.showcaseGroupTitle}>{group.title}</h3>
                      <p className={styles.showcaseGroupSubtitle}>{group.subtitle}</p>
                    </div>
                  </div>

                  <div className={styles.productGrid}>
                    {group.products.map((product) => {
                      const swatches = COLOR_PALETTES[product.category] || ['#0f172a', '#6b7280', '#d97706'];
                      return (
                        <article key={product.id} className={styles.productCardVariant}>
                          <Link
                            to={`/product/${product.id}`}
                            className={styles.productImageWrapVariant}
                            onClick={() => saveRecentlyViewed(product.id)}
                          >
                            <img src={product.images[0]} alt={product.name} className={styles.productImageVariant} />
                            <span className={styles.quickAddBadge}>New</span>
                          </Link>

                          <div className={styles.productBody}>
                            <div className={styles.productTopRow}>
                              <Link to={`/product/${product.id}`} className={styles.productName} onClick={() => saveRecentlyViewed(product.id)}>
                                {product.name}
                              </Link>
                              <button
                                type="button"
                                className={styles.addIconBtn}
                                onClick={() => handleAddItem(product)}
                                aria-label="Add to cart"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className={styles.swatchRow}>
                              {swatches.map((swatch) => (
                                <span key={swatch} className={styles.swatch} style={{ background: swatch }} />
                              ))}
                            </div>
                            <div className={styles.priceRow}>
                              <span className={styles.currentPrice}>{formatCurrency(product.salePrice || product.price)}</span>
                              {product.salePrice && <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>}
                            </div>
                            <button type="button" className={styles.addToCartBtn} onClick={() => handleAddItem(product)}>
                              Add to Cart <ShoppingCart size={16} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {categoryShowcaseProducts.map((product) => {
                const swatches = COLOR_PALETTES[product.category] || ['#0f172a', '#6b7280', '#d97706'];
                return (
                  <article key={product.id} className={styles.productCardVariant}>
                    <Link
                      to={`/product/${product.id}`}
                      className={styles.productImageWrapVariant}
                      onClick={() => saveRecentlyViewed(product.id)}
                    >
                      <img src={product.images[0]} alt={product.name} className={styles.productImageVariant} />
                      <span className={styles.quickAddBadge}>New</span>
                    </Link>

                    <div className={styles.productBody}>
                      <div className={styles.productTopRow}>
                        <Link to={`/product/${product.id}`} className={styles.productName} onClick={() => saveRecentlyViewed(product.id)}>
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          className={styles.addIconBtn}
                          onClick={() => handleAddItem(product)}
                          aria-label="Add to cart"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className={styles.swatchRow}>
                        {swatches.map((swatch) => (
                          <span key={swatch} className={styles.swatch} style={{ background: swatch }} />
                        ))}
                      </div>
                      <div className={styles.priceRow}>
                        <span className={styles.currentPrice}>{formatCurrency(product.salePrice || product.price)}</span>
                        {product.salePrice && <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>}
                      </div>
                      <button type="button" className={styles.addToCartBtn} onClick={() => handleAddItem(product)}>
                        Add to Cart <ShoppingCart size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
          </>
        )}
      </main>

      {!cartCollapsed && (
      <aside className={styles.cartRail}>
        <div className={styles.cartHeader}>
          <div>
            <p className={styles.cartEyebrow}>Your cart</p>
            <h2 className={styles.cartTitle}>{itemCount} items</h2>
          </div>
          <button type="button" className={styles.cartCloseBtn} onClick={() => setCartCollapsed((current) => !current)} aria-label="Toggle cart panel">
            <X size={18} />
          </button>
        </div>

          <div className={styles.cartPanelBody}>
            <div className={styles.cartItems}>
              {cartItems.length > 0 ? cartItems.map((item) => (
                <article key={`${item.id}-${item.variant || 'default'}`} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.cartThumb} />
                  <div className={styles.cartItemBody}>
                    <div className={styles.cartItemTop}>
                      <div>
                        <h3 className={styles.cartItemTitle}>{item.name}</h3>
                        {item.variant && <p className={styles.cartItemVariant}>{item.variant}</p>}
                      </div>
                      <button type="button" className={styles.removeBtn} onClick={() => removeItem(item.id, item.variant)} aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.cartItemBottom}>
                      <span className={styles.cartItemPrice}>{formatCurrency(item.price)}</span>
                      <div className={styles.qtyControl}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)} className={styles.qtyBtn}>
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)} className={styles.qtyBtn}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )) : (
                <div className={styles.emptyCart}>
                  <ShoppingCart size={28} />
                  <p>Your cart is empty</p>
                </div>
              )}
            </div>

            {isDealsView && (
              <div className={styles.promoBox}>
                <label className={styles.promoLabel} htmlFor="promoCode">Promo code</label>
                <div className={styles.promoForm}>
                  <input
                    id="promoCode"
                    type="text"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Enter code"
                    className={styles.promoInput}
                  />
                  <button type="button" className={styles.promoButton} onClick={handleApplyPromo}>
                    Apply
                  </button>
                </div>
                {promoMessage && <p className={styles.promoMessage}>{promoMessage}</p>}
              </div>
            )}

            <div className={styles.summaryBox}>
              <div className={styles.summaryHeader}>
                <p>Order summary</p>
                <button type="button" className={styles.clearCartButton} onClick={clearCart} disabled={cartItems.length === 0}>
                  Clear cart
                </button>
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <strong>-{formatCurrency(savings)}</strong>
              </div>
              {isDealsView && appliedDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Promo discount</span>
                  <strong>-{formatCurrency(appliedDiscount)}</strong>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <strong>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</strong>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>

            <button type="button" className={styles.checkoutButton} onClick={() => navigate('/checkout')}>
              Place Order ({itemCount})
            </button>

            <div className={styles.paymentPills}>
              {PAYMENT_METHODS.map((method) => (
                <span key={method} className={styles.paymentPill}>{method}</span>
              ))}
            </div>

            <section className={styles.recoSection}>
              <div className={styles.recoHeader}>
                <h3>You might also like</h3>
                <span>Smart picks</span>
              </div>
              <div className={styles.recoList}>
                {cartRecommendations.map((product) => (
                  <article key={product.id} className={styles.recoCard}>
                    <img src={product.images[0]} alt={product.name} className={styles.recoThumb} />
                    <div className={styles.recoBody}>
                      <h4>{product.name}</h4>
                      <span>{formatCurrency(product.salePrice || product.price)}</span>
                    </div>
                    <button type="button" className={styles.recoAddBtn} onClick={() => handleAddItem(product)} aria-label={`Add ${product.name}`}>
                      <Plus size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.recentSection}>
              <div className={styles.recoHeader}>
                <h3>Recently viewed</h3>
                <span>{recentlyViewed.length} items</span>
              </div>
              <div className={styles.recentStrip}>
                {recentlyViewed.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className={styles.recentThumbWrap}>
                    <img src={product.images[0]} alt={product.name} className={styles.recentThumb} />
                  </Link>
                ))}
              </div>
            </section>

            <div className={styles.clubCard}>
              <p className={styles.clubEyebrow}>Trendora Club</p>
              <h3>Join the members-only savings circle</h3>
              <p>Get priority drops, early access deals, and special offers designed for loyal shoppers.</p>
              <Link to="/profile" className={styles.clubButton}>
                Join now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
      </aside>
      )}
    </div>
  );
}