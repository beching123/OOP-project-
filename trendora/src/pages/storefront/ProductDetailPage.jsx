import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useCartStore from '../../stores/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { productService } from '../../services/productService';
import Button from '../../components/ui/Button';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [apiProduct, setApiProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const numId = id?.replace('api-', '');
        if (numId && !isNaN(numId)) {
          const res = await productService.getProduct(numId);
          const p = res.data;
          setApiProduct({
            id: `api-${p.id}`,
            apiId: p.id,
            name: p.name,
            description: p.description || '',
            subtitle: p.description || '',
            price: p.price,
            salePrice: p.salePrice || null,
            category: p.categoryName || p.category || 'other',
            images: p.images?.length ? p.images : [p.imageUrl || 'https://placehold.co/400x400?text=No+Image'],
            rating: p.rating || 4.5,
            reviews: p.reviews || 0,
            stock: p.stock ?? p.stockQuantity ?? 0,
            inStock: (p.stock ?? p.stockQuantity ?? 0) > 0,
          });
          try {
            const catRes = await productService.getProducts({ category: p.categoryName || p.category, limit: 5 });
            const cats = catRes.data?.content || catRes.data || [];
            setRelatedProducts(Array.isArray(cats) ? cats.filter(rp => rp.id !== p.id).slice(0, 4) : []);
          } catch {
            setRelatedProducts([]);
          }
        }
      } catch {
        // API not available
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const product = apiProduct;
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{loading ? 'Loading product...' : t('common.noResults')}</h2>
        {!loading && <Button onClick={() => navigate('/catalog')}>{t('common.backToHome')}</Button>}
      </div>
    );
  }

  const handleVariantSelect = (variantName, option) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    // If product has variants, make sure all are selected
    if (product.variants) {
      const missingVariant = product.variants.find(v => !selectedVariants[v.name]);
      if (missingVariant) {
        toast.error(`Please select a ${missingVariant.name}`);
        return;
      }
    }
    
    // Create a deterministic variant string for cart
    const variantString = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}:${v}`)
      .join(' | ');
      
    addItem(product, quantity, variantString || null);
    
    // Optional: show a toast
    // toast.success('Added to cart!');
  };

  return (
    <div className={styles.productPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container px-6 py-4 flex items-center gap-2 text-sm text-muted">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span>/</span>
          <Link to={`/catalog/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-text truncate font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container py-8">
        <div className={styles.productGrid}>
          
          {/* Images Section */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <img src={product.images[activeImage]} alt={product.name} className={styles.mainImage} />
              {product.salePrice && <span className={styles.saleBadge}>Sale</span>}
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbnailList}>
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`${styles.thumbnailBtn} ${activeImage === idx ? styles.activeThumbnail : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className={styles.detailsSection}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-text mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-accent-soft text-accent px-2 py-1 rounded-md text-sm font-bold">
                  <Star size={14} fill="currentColor" stroke="none" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-muted text-sm">{product.reviews} {t('product.reviews')}</span>
                <span className="text-border">|</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                  {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                </span>
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-sm text-warning animate-pulse">({t('product.lowStock', { count: product.stock })})</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">{formatCurrency(product.salePrice || product.price)}</span>
                {product.salePrice && (
                  <span className="text-xl text-muted line-through">{formatCurrency(product.price)}</span>
                )}
              </div>
            </div>

            <p className="text-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.map(variant => (
              <div key={variant.name} className="mb-6">
                <h4 className="font-medium text-sm mb-3 uppercase tracking-wide">{variant.name}</h4>
                <div className="flex flex-wrap gap-3">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      className={`${styles.variantOption} ${selectedVariants[variant.name] === option ? styles.activeVariantOption : ''}`}
                      onClick={() => handleVariantSelect(variant.name, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className={styles.actionsBox}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-medium">{t('product.quantity')}:</span>
                <div className={styles.qtyControl}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn} disabled={product.stock === 0}><Minus size={16} /></button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className={styles.qtyBtn} disabled={product.stock === 0 || quantity >= product.stock}><Plus size={16} /></button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className={styles.cartBtn} 
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} className="mr-2" /> {t('product.addToCart')}
                </Button>
                <Button variant="outline" size="lg" className={styles.wishBtn}>
                  <Heart size={24} />
                </Button>
              </div>
            </div>

            {/* Mini Trust Block */}
            <div className={styles.miniTrust}>
              <div className={styles.miniTrustItem}>
                <Truck size={20} className="text-primary" />
                <span className="text-sm font-medium">{t('home.freeDelivery')}</span>
              </div>
              <div className={styles.miniTrustItem}>
                <ShieldCheck size={20} className="text-primary" />
                <span className="text-sm font-medium">{t('home.securePayment')}</span>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <section className={styles.relatedSection}>
                <div className={styles.relatedHeader}>
                  <div>
                    <h2 className={styles.relatedTitle}>Related {product.category}</h2>
                    <p className={styles.relatedSubtitle}>Small picks from the same category.</p>
                  </div>
                  <Link to={`/catalog/${product.category}`} className={styles.relatedAction}>
                    More in category
                  </Link>
                </div>

                <div className={styles.relatedGrid}>
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/product/${relatedProduct.id}`}
                      className={styles.relatedCard}
                    >
                      <div className={styles.relatedImageWrap}>
                        <img src={relatedProduct.images[0]} alt={relatedProduct.name} className={styles.relatedImage} />
                        {relatedProduct.salePrice && <span className={styles.relatedBadge}>Sale</span>}
                      </div>
                      <div className={styles.relatedBody}>
                        <h3 className={styles.relatedName}>{relatedProduct.name}</h3>
                        <div className={styles.relatedPriceRow}>
                          <span className={styles.relatedPrice}>{formatCurrency(relatedProduct.salePrice || relatedProduct.price)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabHeaders}>
            <button 
              className={`${styles.tabHeader} ${activeTab === 'description' ? styles.activeTabHeader : ''}`}
              onClick={() => setActiveTab('description')}
            >
              {t('product.description')}
            </button>
            <button 
              className={`${styles.tabHeader} ${activeTab === 'specs' ? styles.activeTabHeader : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              {t('product.specifications')}
            </button>
            <button 
              className={`${styles.tabHeader} ${activeTab === 'reviews' ? styles.activeTabHeader : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('product.reviews')} ({product.reviews})
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className="prose max-w-none text-muted">
                <p>This premium product from TRENDORA is guaranteed to meet your expectations. Sourced directly to ensure the best pricing, delivering quality to our customers in Cameroon and beyond.</p>
                <p className="mt-4">{product.description}</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>High quality materials</li>
                  <li>Durable and reliable</li>
                  <li>100% authenticity guaranteed</li>
                </ul>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                <div className="flex border-b border-border py-2">
                  <span className="font-semibold w-1/3">SKU</span>
                  <span className="text-muted">{product.sku}</span>
                </div>
                <div className="flex border-b border-border py-2">
                  <span className="font-semibold w-1/3">Category</span>
                  <span className="text-muted capitalize">{product.category}</span>
                </div>
                <div className="flex border-b border-border py-2">
                  <span className="font-semibold w-1/3">Brand</span>
                  <span className="text-muted">TRENDORA</span>
                </div>
                <div className="flex border-b border-border py-2">
                  <span className="font-semibold w-1/3">Weight</span>
                  <span className="text-muted">0.5 kg</span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-10">
                <Star size={48} className="mx-auto text-border mb-4" />
                <p className="text-muted text-lg">Reviews will be visible once backend is connected.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
