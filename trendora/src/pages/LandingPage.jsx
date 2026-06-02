import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Heart, ShoppingBag, Zap, Award, Users, MapPin, Phone, Mail, Clock, Send, FileText, RefreshCw, AlertTriangle, PackageCheck } from 'lucide-react';
import LandingNavbar from '../components/storefront/LandingNavbar';

import heroWatch from '../assets/images resouces/electronics/smartwatch2.jpeg';
import heroPerfume from '../assets/images resouces/perfume/perfume4.jpeg';
import heroShoes from '../assets/images resouces/clothe/male ware/shoes1.jpeg';
import heroBag from '../assets/images resouces/clothe/women bags/bag7.jpeg';
import catElectronics from '../assets/images resouces/electronics/laptop1.jpeg';
import catFashion from '../assets/images resouces/clothe/women ware/clothe1.jpeg';
import catHome from '../assets/images resouces/house furnitures/chair1.jpeg';
import catBeauty from '../assets/images resouces/perfume/perfume.jpeg';
import catSports from '../assets/images resouces/sport bike.jpeg';
import prod1 from '../assets/images resouces/electronics/headphone1.jpeg';
import prod2 from '../assets/images resouces/electronics/airfryer.jpeg';
import prod3 from '../assets/images resouces/house furnitures/chair8.jpg';
import prod4 from '../assets/images resouces/perfume/perfume3.jpeg';
import prod5 from '../assets/images resouces/clothe/male ware/dressing shoes.jpeg';
import prod6 from '../assets/images resouces/electronics/speckers.jpeg';
import customer1 from '../assets/images resouces/customer1.jpg';
import customer2 from '../assets/images resouces/customer2.jpg';
import customer3 from '../assets/images resouces/customer3.jpg';

const GREEN = '#1a5c2e';
const GREEN_LIGHT = '#e8f5e9';
const GOLD = '#c9a84c';

const categories = [
  { name: 'Electronics', image: catElectronics, count: '200+ Products', color: '#1e3a5f' },
  { name: 'Fashion', image: catFashion, count: '350+ Products', color: '#5f1e3a' },
  { name: 'Home & Living', image: catHome, count: '150+ Products', color: '#1e5f3a' },
  { name: 'Beauty & Health', image: catBeauty, count: '100+ Products', color: '#3a1e5f' },
  { name: 'Sports', image: catSports, count: '50+ Products', color: '#5f3a1e' },
];

const featuredProducts = [
  { name: 'Wireless Headphones', price: '25,000', image: prod1, badge: 'Best Seller' },
  { name: 'Air Fryer Pro', price: '45,000', image: prod2, badge: 'New' },
  { name: 'Modern Armchair', price: '65,000', image: prod3, badge: 'Premium' },
  { name: 'Premium Perfume', price: '12,000', image: prod4, badge: 'Trending' },
  { name: 'Dress Shoes', price: '18,000', image: prod5, badge: 'Classic' },
  { name: 'Bluetooth Speaker', price: '15,000', image: prod6, badge: 'Hot' },
];

const testimonials = [
  { name: 'Marie N.', location: 'Buea', text: 'The quality of products I received exceeded my expectations. Fast delivery and excellent customer service!', rating: 5, image: customer1 },
  { name: 'Paul K.', location: 'Douala', text: 'I shop here regularly. The prices are fair and the delivery is always on time. Highly recommended!', rating: 5, image: customer2 },
  { name: 'Grace M.', location: 'Yaoundé', text: 'Finally a trustworthy online store in Cameroon. The product quality is consistently amazing.', rating: 5, image: customer3 },
];

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '5,000+', label: 'Products Sold' },
  { number: '4.9', label: 'Average Rating' },
  { number: '24h', label: 'Fast Delivery' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', color: '#1a1a1a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          min-height: 85vh;
          padding: 4rem 1.5rem;
        }
        .hero-images-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          height: 500px;
        }
        .hero-images-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hero-images-col-offset {
          margin-top: 3rem;
        }
        .hero-free-delivery {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 1rem;
          background: white;
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          white-space: nowrap;
        }
        .hero-stat-row {
          display: flex;
          gap: 2rem;
          margin-top: 3rem;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 3rem 1rem;
            gap: 2rem;
          }
          .hero-images-grid {
            display: none;
          }
          .hero-stat-row {
            gap: 1rem;
            flex-wrap: wrap;
          }
          .hero-free-delivery {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            margin-top: 1rem;
            justify-content: center;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-grid {
            gap: 2rem;
            padding: 4rem 1.5rem;
          }
          .hero-images-grid {
            height: 400px;
          }
          .hero-images-col:first-child {
            margin-top: 2rem;
          }
        }
      `}</style>

      <LandingNavbar />

      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#000000', padding: '0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,92,46,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(26,92,46,0.5) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, background: `radial-gradient(circle at 20% 30%, ${GOLD}, transparent 40%), radial-gradient(circle at 80% 70%, ${GREEN}, transparent 40%)` }} />
        <div className="container hero-grid">
          <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '999px', border: `1px solid ${GOLD}44`, background: `${GOLD}15`, marginBottom: '1.5rem' }}>
              <Zap size={14} color={GOLD} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cameroon's Premium Marketplace</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '1.5rem', fontFamily: "Georgia, 'Times New Roman', serif", color: 'white' }}>
              Discover Quality<br />at Your <span style={{ color: GOLD, fontStyle: 'italic' }}>Doorstep</span>
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', maxWidth: '500px', marginBottom: '2rem' }}>
              Handpicked premium products delivered with care. From electronics to fashion, experience shopping like never before.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '999px', background: `linear-gradient(135deg, ${GREEN}, #236b38)`, color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s', boxShadow: `0 8px 32px ${GREEN}33` }}>
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '999px', background: `linear-gradient(135deg, ${GOLD}, #b8943f)`, color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s', boxShadow: `0 8px 32px ${GOLD}33` }}>
                Create Account
              </Link>
            </div>
            <div className="hero-stat-row">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: i === 1 ? GOLD : '#a8e6b8' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-images-grid">
            <div className="hero-images-col hero-images-col-offset">
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '240px', border: '1px solid #e0e0e0' }}>
                <img src={heroWatch} alt="Smart Watch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '220px', border: '1px solid #e0e0e0' }}>
                <img src={heroShoes} alt="Premium Shoes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="hero-images-col">
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '200px', border: '1px solid #e0e0e0' }}>
                <img src={heroPerfume} alt="Premium Perfume" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '260px', border: '1px solid #e0e0e0' }}>
                <img src={heroBag} alt="Designer Bag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="hero-free-delivery">
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={18} color={GREEN} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>Free Delivery</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>On orders over 50,000 XAF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { icon: ShieldCheck, text: 'Secure Payment', color: GREEN },
            { icon: Truck, text: 'Fast Delivery', color: '#3b82f6' },
            { icon: RotateCcw, text: '30-Day Returns', color: '#8b5cf6' },
            { icon: Award, text: 'Quality Guaranteed', color: GOLD },
            { icon: Users, text: '10,000+ Customers', color: '#ec4899' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <item.icon size={18} color={item.color} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Browse By Category</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>Explore Our <span style={{ color: GREEN, fontStyle: 'italic' }}>Collections</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link key={cat.name} to="/register" style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', height: '280px', display: 'block', textDecoration: 'none' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${cat.color}ee 100%)` }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', color: 'white' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>{cat.count}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Curated For You</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>Featured <span style={{ color: GREEN, fontStyle: 'italic' }}>Products</span></h2>
            </div>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: GREEN, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {featuredProducts.map((product) => (
              <Link key={product.name} to="/register" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid #eee', background: 'white', transition: 'all 0.3s', cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#f5f5f5' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: GREEN, color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                    {product.badge}
                  </div>
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={16} color="#666" />
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1a1a1a' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: GREEN }}>XAF {product.price}</span>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: GREEN, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '5rem 0', background: '#f8f6f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Why Choose Us</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>The Trendora <span style={{ color: GREEN, fontStyle: 'italic' }}>Difference</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: ShieldCheck, title: 'Secure Payments', desc: 'Your transactions are protected with bank-level encryption. Pay with MTN MoMo, Orange Money, or card.' },
              { icon: Truck, title: 'Nationwide Delivery', desc: 'We deliver to every corner of Cameroon. Track your order in real-time from our warehouse to your doorstep.' },
              { icon: RotateCcw, title: 'Easy Returns', desc: 'Not satisfied? Return within 30 days for a full refund. No questions asked, no hassle involved.' },
              { icon: Star, title: 'Premium Quality', desc: 'Every product is handpicked and quality-checked before it reaches you. Excellence is our standard.' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '2rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e0e0e0', transition: 'all 0.3s' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: GOLD }}>
                  <item.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Testimonials</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>What Our <span style={{ color: GREEN, fontStyle: 'italic' }}>Customers</span> Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ padding: '2rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #eee', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill={GOLD} color={GOLD} />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#555', marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={t.image} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ padding: '4rem 0', background: GREEN, color: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "Georgia, 'Times New Roman', serif" }}>{stat.number}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.85, marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Ready to Start <span style={{ color: GREEN, fontStyle: 'italic' }}>Shopping?</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.7, marginBottom: '2rem' }}>
              Join thousands of satisfied customers across Cameroon. Create your free account today and enjoy premium shopping.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '999px', background: GREEN, color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: `0 8px 32px ${GREEN}33` }}>
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '999px', border: `2px solid ${GREEN}`, color: GREEN, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
                Sign In Instead <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '5rem 0', background: '#f8f6f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>About Us</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>The Story of <span style={{ color: GREEN, fontStyle: 'italic' }}>Trendora</span></h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#555', marginBottom: '1rem' }}>
                Founded in 2024, Trendora started with a simple mission: make quality products accessible and affordable for everyone in Cameroon and beyond.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#555', marginBottom: '2rem' }}>
                Based in Buea, we curate products across electronics, fashion, home living, beauty, and sports — bringing you the best at prices that make sense.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'white', border: '1px solid #e0e0e0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: GREEN }}>8+</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Founding Members</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'white', border: '1px solid #e0e0e0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: GREEN }}>5</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Product Categories</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '250px' }}>
                <img src={catFashion} alt="Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', height: '250px', marginTop: '2rem' }}>
                <img src={catElectronics} alt="Electronics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Get in Touch</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>Contact <span style={{ color: GREEN, fontStyle: 'italic' }}>Us</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { icon: MapPin, title: 'Visit Us', detail: 'Molyko, Buea', sub: 'South-West Region, Cameroon' },
              { icon: Phone, title: 'Call Us', detail: '+237 XXX XXX XXX', sub: 'Mon - Sat: 8AM - 6PM' },
              { icon: Mail, title: 'Email Us', detail: 'info@trendora.cm', sub: 'We reply within 2 hours' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '2rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: GREEN }}>
                  <item.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>{item.detail}</p>
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>{item.sub}</p>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.7 }}>
              Have a question or need help? We're here for you. Reach out through any of the channels above and our team will get back to you promptly.
            </p>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '999px', background: GREEN, color: 'white', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginTop: '1.5rem', boxShadow: `0 4px 16px ${GREEN}33` }}>
              Contact Support <Send size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Return Policy Section */}
      <section id="return-policy" style={{ padding: '5rem 0', background: '#f8f6f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Hassle-Free Returns</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: "Georgia, 'Times New Roman', serif" }}>Return <span style={{ color: GREEN, fontStyle: 'italic' }}>Policy</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { icon: RotateCcw, title: '30-Day Window', desc: 'Return most eligible items within 30 days of delivery for a full refund.' },
              { icon: PackageCheck, title: 'Easy Process', desc: 'Contact support, get a return authorization, and ship it back or drop it off.' },
              { icon: RefreshCw, title: 'Full Refund', desc: 'Once we receive and inspect your return, your refund is processed within 5 business days.' },
              { icon: AlertTriangle, title: 'Conditions', desc: 'Items must be unused, in original packaging. Some categories like underwear and beauty products are final sale.' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '2rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e0e0e0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: GREEN }}>
                  <item.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '999px', background: GREEN, color: 'white', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: `0 4px 16px ${GREEN}33` }}>
              Start a Return <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', fontFamily: "Georgia, 'Times New Roman', serif", color: GOLD }}>
                TRENDORA
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                Cameroon's premium e-commerce destination. Quality products, secure payments, and fast delivery — all in one place.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/register" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>Shop</Link>
                <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>About Us</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Contact</a>
                <a href="#return-policy" onClick={(e) => { e.preventDefault(); document.getElementById('return-policy')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Return Policy</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer Service</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/register" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>Track Order</Link>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>FAQ</a>
                <a href="#return-policy" onClick={(e) => { e.preventDefault(); document.getElementById('return-policy')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Privacy Policy</a>
                <a href="#return-policy" onClick={(e) => { e.preventDefault(); document.getElementById('return-policy')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Terms of Service</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                <span>Buea, South-West Region</span>
                <span>Cameroon</span>
                <span>+237 XXX XXX XXX</span>
                <span>info@trendora.cm</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            &copy; 2026 TRENDORA. All rights reserved. Built with care in Cameroon.
          </div>
        </div>
      </footer>
    </div>
  );
}
