import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { mockCategories } from '../../data/categories';
import { mockProducts } from '../../data/products';
import { mockBrands } from '../../data/brands';
import { mockTestimonials } from '../../data/testimonials';
import { mockSocialContent } from '../../data/socialContent';
import { FLASH_DEALS } from '../../data/flashDeals';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './HomePage.module.css';

// Hero slideshow — one image per category
import slideElectronics from '../../assets/images resouces/electronics/tv1.jpeg';
import slideFashion from '../../assets/images resouces/clothe/women shoes/shoes1.jpg';
import slideHome from '../../assets/images resouces/house furnitures/chair5.jpeg';
import slideBeauty from '../../assets/images resouces/perfume/perfume.jpeg';
import slideSports from '../../assets/images resouces/sport bike.jpeg';

const SLIDES = [
  {
    image: slideFashion,
    title: 'New Season',
    highlight: 'Fashion',
    subtitle: 'Explore the latest trends in clothing, accessories and footwear.',
    cta: 'Explore Fashion',
    link: '/catalog/fashion',
  },
  {
    image: slideElectronics,
    title: 'Top',
    highlight: 'Electronics',
    subtitle: 'Smartphones, TVs, laptops and more — at unbeatable prices.',
    cta: 'Shop Electronics',
    link: '/catalog/electronics',
  },
  {
    image: slideHome,
    title: 'Home &',
    highlight: 'Living',
    subtitle: 'Transform your living space with our curated home furniture and décor.',
    cta: 'Shop Home',
    link: '/catalog/home-living',
  },
  {
    image: slideBeauty,
    title: 'Beauty &',
    highlight: 'Health',
    subtitle: 'Premium skincare, wellness and beauty products delivered to you.',
    cta: 'Shop Beauty',
    link: '/catalog/beauty-health',
  },
  {
    image: slideSports,
    title: 'Sports &',
    highlight: 'Fitness',
    subtitle: 'Top-quality sports gear and fitness equipment for every athlete.',
    cta: 'Shop Sports',
    link: '/catalog/sports',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % SLIDES.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goToSlide]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const showcasedCategories = mockCategories.slice(0, 4);
  const trendingNowProducts = [mockProducts[0], mockProducts[1], mockProducts[2], mockProducts[3], mockProducts[4], mockProducts[6], mockProducts[7], mockProducts[8], mockProducts.find((product) => product.id === 'p-59')]
    .filter(Boolean);

  return (
    <div className={styles.page}>

      {/* =============================================
          1. HERO SLIDESHOW
          ============================================= */}
      <section className={styles.hero}>
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === current ? styles.slideActive : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.slideOverlay} />
            <div className={`container ${styles.slideContent}`}>
              <h1 className={styles.slideTitle}>
                {slide.title} <span className={styles.slideHighlight}>{slide.highlight}</span>
              </h1>
              <p className={styles.slideSubtitle}>{slide.subtitle}</p>
              <Link to={slide.link} className={styles.slideCta}>
                {slide.cta} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        ))}

        {/* Prev / Next arrows */}
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={28} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {SLIDES.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === current ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =============================================
          2. TRUST BADGES
          ============================================= */}
      <section className={styles.trustSection}>
        <div className={`container ${styles.trustGrid}`}>
          <div className={styles.trustCard}>
            <Truck size={38} className={styles.trustIcon} />
            <div>
              <h3 className={styles.trustTitle}>{t('home.freeDelivery')}</h3>
              <p className={styles.trustDesc}>{t('home.freeDeliveryDesc')}</p>
            </div>
          </div>
          <div className={styles.trustCard}>
            <ShieldCheck size={38} className={styles.trustIcon} />
            <div>
              <h3 className={styles.trustTitle}>{t('home.securePayment')}</h3>
              <p className={styles.trustDesc}>{t('home.securePaymentDesc')}</p>
            </div>
          </div>
          <div className={styles.trustCard}>
            <RefreshCw size={38} className={styles.trustIcon} />
            <div>
              <h3 className={styles.trustTitle}>{t('home.easyReturns')}</h3>
              <p className={styles.trustDesc}>{t('home.easyReturnsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          3. BROWSE BY SELECTIONS (Categories)
          ============================================= */}
      <section className={styles.selectionsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Shop <span className={styles.titleHighlight}>Smart</span>
          </h2>
          <p className={styles.selectionIntro}>
            Jump straight into the collections that match your style, space, and budget.
          </p>
          <div className={styles.sectionCtaRowRight}>
            <Link to="/catalog" className={styles.sectionCtaLink}>
              Browse all categories <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.categoryGrid}>
            {showcasedCategories.map((cat, idx) => (
              <Link to={`/catalog/${cat.id}`} key={cat.id} className={styles.categoryCard}>
                <div className={`${styles.categoryImgBox} ${styles[`cardImg${idx % 4}`]}`}>
                  <img src={cat.image} alt={cat.name} className={styles.categoryImg} />
                  <div className={styles.categoryOverlay} />
                  <div className={styles.categoryMeta}>
                    <h3 className={styles.categoryTitle}>{cat.name}</h3>
                    <div className={styles.categorySub}>
                      <span className={styles.categoryCount}>{cat.itemCount} items</span>
                      <span className={styles.categoryExplore}>Explore <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          4. CURATED PICKS (was Featured Pieces)
          A compact, high-conversion row of hand-picked items with a short intro.
          ============================================= */}
      <section className={styles.featuredSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Trending <span className={styles.titleHighlight}>Now</span>
          </h2>
          <p className={styles.sectionIntro}>
            Discover the hottest picks selected for modern style, trusted quality, and smart value. These are the products customers love and keep coming back for.
          </p>
          <div className={styles.featuredGrid}>
            <div className={styles.smallCardRow}>
              {trendingNowProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className={styles.smallCard}>
                  <div className={styles.smallCardImgWrap}>
                    <img src={product.images[0]} alt={product.name} className={styles.smallCardImg} />
                    {product.isFeatured && <span className={styles.smallBadge}>Hot</span>}
                  </div>
                  <div className={styles.smallCardInfo}>
                    <h3 className={styles.smallCardTitle}>{product.name}</h3>
                    <div className={styles.smallCardPrice}>
                      <span className={styles.smallPrice}>{formatCurrency(product.salePrice || product.price)}</span>
                      {product.salePrice && <span className={styles.smallOld}>{formatCurrency(product.price)}</span>}
                    </div>
                    <div className={styles.smallCardMeta}>
                      <span className={styles.smallRating}>★ {product.rating}</span>
                      <span className={styles.smallReviews}>{product.reviews} reviews</span>
                      <Link to={`/product/${product.id}`} className={styles.smallDiscover}>Discover</Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.featuredActions}>
              <Link to="/catalog" className={styles.viewAllRight}>
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          5. BEST SELLERS
          ============================================= */}
      <section className={styles.bestSellersSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Best <span className={styles.titleHighlight}>Sellers</span>
          </h2>
          <p className={styles.sectionIntro}>
            Check out the products our customers love most. Top-rated and trusted by thousands.
          </p>
          <div className={styles.bestSellersGrid}>
            {mockProducts.filter(p => p.isBestSeller).slice(0, 4).map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className={styles.bestSellerCard}>
                <div className={styles.bestSellerImgWrap}>
                  <img src={product.images[0]} alt={product.name} className={styles.bestSellerImg} />
                  <span className={styles.bestSellerBadge}>⭐ {product.rating}</span>
                </div>
                <div className={styles.bestSellerInfo}>
                  <h3 className={styles.bestSellerTitle}>{product.name}</h3>
                  <div className={styles.bestSellerRating}>
                    <span className={styles.ratingStars}>★ {product.rating}</span>
                    <span className={styles.ratingCount}>({product.reviews})</span>
                  </div>
                  <div className={styles.bestSellerPrice}>
                    <span className={styles.currentPrice}>{formatCurrency(product.salePrice || product.price)}</span>
                    {product.salePrice && <span className={styles.oldPrice}>{formatCurrency(product.price)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          6. CUSTOMER TESTIMONIALS
          ============================================= */}
      <section className={styles.testimonialSection}>
        <div className="container">
          <div className={styles.testimonialHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>
                Customer <span className={styles.titleHighlight}>Voices</span>
              </h2>
              <p className={styles.sectionIntro}>
                Honest feedback from shoppers who wanted quality, speed, and prices that still feel kind.
              </p>
            </div>
            <div className={styles.testimonialLabel}>Loved by shoppers across Cameroon</div>
          </div>

          <div className={styles.testimonialLayout}>
            <article className={styles.testimonialFeature}>
              <div className={styles.testimonialFeatureTop}>
                <img src={mockTestimonials[0].image} alt={mockTestimonials[0].name} className={styles.testimonialFeatureAvatar} />
                <div>
                  <p className={styles.testimonialFeatureRole}>{mockTestimonials[0].role}</p>
                  <h3 className={styles.testimonialFeatureName}>{mockTestimonials[0].name}</h3>
                </div>
              </div>
              <div className={styles.testimonialFeatureQuoteMark}>“</div>
              <p className={styles.testimonialFeatureText}>{mockTestimonials[0].text}</p>
              <div className={styles.testimonialFeatureFooter}>
                <span className={styles.testimonialFeatureStars}>{'★'.repeat(mockTestimonials[0].rating)}</span>
                <span className={styles.testimonialFeatureProduct}>Bought: <strong>{mockTestimonials[0].product}</strong></span>
              </div>
            </article>

            <div className={styles.testimonialStack}>
              {mockTestimonials.slice(1).map((testimonial) => (
                <article key={testimonial.id} className={styles.testimonialRailItem}>
                  <img src={testimonial.image} alt={testimonial.name} className={styles.testimonialRailAvatar} />
                  <div className={styles.testimonialRailBody}>
                    <div className={styles.testimonialRailTop}>
                      <h4 className={styles.testimonialRailName}>{testimonial.name}</h4>
                      <span className={styles.testimonialRailStars}>{'★'.repeat(testimonial.rating)}</span>
                    </div>
                    <p className={styles.testimonialRailText}>{testimonial.text}</p>
                    <p className={styles.testimonialRailProduct}>{testimonial.product}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          7. FLASH DEALS
          ============================================= */}
      <section className={styles.flashDealsSection}>
        <div className="container">
          <div className={styles.flashHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Flash <span className={styles.titleHighlight}>Deals</span>
              </h2>
              <p className={styles.sectionIntro}>
                Fresh drops with clean pricing, fast savings, and completely new visuals.
              </p>
            </div>
            <div className={styles.flashTicker}>
              <span className={styles.flashTickerDot} />
              Ends soon, prices locked for a limited run
            </div>
          </div>

          <div className={styles.flashDealsGrid}>
            {FLASH_DEALS.map((deal) => {
              const discount = Math.round(((deal.price - deal.salePrice) / deal.price) * 100);
              return (
                <Link to="/catalog" key={deal.id} className={styles.flashDealCard}>
                  <div className={styles.flashDealMedia}>
                    <img src={deal.image} alt={deal.name} className={styles.flashDealImage} />
                    <span className={styles.flashDealBadge}>{deal.badge}</span>
                  </div>
                  <div className={styles.flashDealInfo}>
                    <p className={styles.flashDealCategory}>{deal.category}</p>
                    <h3 className={styles.flashDealTitle}>{deal.name}</h3>
                    <p className={styles.flashDealText}>{deal.subtitle}</p>
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
                      <button
                        type="button"
                        className={styles.flashDealCartBtn}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigate('/catalog/deals');
                        }}
                      >
                        Unlock Deal
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =============================================
          8. SOCIAL PROOF / USER CONTENT
          ============================================= */}
      <section className={styles.socialProofSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Our <span className={styles.titleHighlight}>Community</span>
          </h2>
          <p className={styles.sectionIntro}>
            See how customers are using Trendora products. Their posts are proof of the service, care, and consistency we work to deliver every day.
          </p>
          <p className={styles.communityProofText}>
            Choose Trendora for affordable quality, dependable service, and a shopping experience that keeps customers coming back with confidence.
          </p>
          <div className={styles.socialGrid}>
            {mockSocialContent.map((post) => (
              <div key={post.id} className={styles.socialCard}>
                <img src={post.image} alt={post.username} className={styles.socialImage} />
                <div className={styles.socialOverlay}>
                  <div className={styles.socialStats}>
                    <div className={styles.statItem}>
                      <Heart size={20} />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                  <p className={styles.socialUsername}>{post.username}</p>
                  <p className={styles.socialCaption}>{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          10. BRANDS STRIP
          ============================================= */}
      <section className={styles.brandStripSection}>
        <div className="container">
          <div className={styles.brandStripHeader}>
            <p className={styles.brandStripLabel}>Associated brands</p>
            <Link to="/catalog" className={styles.brandStripLink}>
              Explore catalog <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.brandStripWindow}>
            <div className={styles.brandStripTrack}>
              {[...mockBrands, ...mockBrands].map((brand, index) => (
                <div key={`${brand.id}-${index}`} className={styles.brandStripItem}>
                  <img src={brand.logoUrl} alt={brand.name} className={styles.brandStripLogo} />
                  <span className={styles.brandStripName}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
