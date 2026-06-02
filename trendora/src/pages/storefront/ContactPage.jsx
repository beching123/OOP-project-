import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supportService } from '../../services/supportService';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Users,
  Headphones,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import heroImg from '../../assets/images resouces/(1) Instagram.jfif';
import styles from './ContactPage.module.css';

const contactChannels = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@trendora.cm',
    description: 'We reply within 2 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+237 600 00 00 00',
    description: 'Mon - Sat phone support',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    detail: 'WhatsApp support',
    description: 'Available 24/7',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: 'Molyko, Buea',
    description: 'Our headquarters',
  },
];

const topicOptions = [
  { id: 'order', label: 'Order Issue', icon: HelpCircle },
  { id: 'return', label: 'Returns & Refunds', icon: ShieldCheck },
  { id: 'partnership', label: 'Partnership', icon: Users },
  { id: 'product', label: 'Product Query', icon: Globe },
  { id: 'other', label: 'Other', icon: MessageCircle },
];

const faqItems = [
  {
    question: 'How long does delivery take?',
    answer:
      'Most orders are processed within 24 hours. Deliveries in and around Buea are often same-day, while other locations usually arrive within 3 to 5 business days.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Eligible items can be returned within 30 days of delivery. Visit our return policy page for the full process and conditions.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'You can track your order by contacting support with your order number. We also share key updates by email and WhatsApp.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, selected products can be shipped internationally depending on the destination, item type, and delivery partner availability.',
  },
  {
    question: 'Can I partner with Trendora?',
    answer:
      'Absolutely. We welcome brand partnerships, supplier collaborations, and project-based proposals. Use the contact form and choose Partnership.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes. We use trusted payment flows and secure checkout practices to help protect your information during every transaction.',
  },
];

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Instant help from our support team during business hours and on WhatsApp.',
    action: 'Start a Chat',
    href: 'https://wa.me/237600000001',
    color: '#34A853',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send a detailed message and a real Trendora team member will follow up.',
    action: 'Send an Email',
    href: 'mailto:support@trendora.cm',
    color: '#F0A500',
  },
  {
    icon: ShieldCheck,
    title: 'Help Centre',
    description: 'Browse return, shipping, and shopping guidance to get quick answers.',
    action: 'Browse Articles',
    href: '/return-policy',
    color: '#3B82F6',
  },
];

const businessHours = [
  { day: 'Monday', time: '8:00 AM - 6:00 PM', active: true },
  { day: 'Tuesday', time: '8:00 AM - 6:00 PM', active: true },
  { day: 'Wednesday', time: '8:00 AM - 6:00 PM', active: true },
  { day: 'Thursday', time: '8:00 AM - 6:00 PM', active: true },
  { day: 'Friday', time: '8:00 AM - 6:00 PM', active: true },
  { day: 'Saturday', time: '8:00 AM - 4:00 PM', active: true },
  { day: 'Sunday', time: 'Closed', active: false },
];

const socialLinks = [
  { icon: Globe, label: 'Facebook', href: 'https://facebook.com/trendora.cm' },
  { icon: MessageCircle, label: 'Instagram', href: 'https://instagram.com/trendora.cm' },
  { icon: Mail, label: 'YouTube', href: 'https://youtube.com/@trendora' },
  { icon: Phone, label: 'WhatsApp', href: 'https://wa.me/237600000001' },
];

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState('order');
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', orderNumber: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await supportService.createTicket({
        subject: selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1).replace(/-/g, ' '),
        message: `[${form.firstName} ${form.lastName}] [${form.email}] [${form.phone}]${form.orderNumber ? ' [Order: ' + form.orderNumber + ']' : ''}\n\n${form.message}`,
        category: selectedTopic,
        priority: 'medium',
        orderNumber: form.orderNumber || undefined,
      });
      toast.success('Message sent! We\'ll get back to you within 2 hours.');
      setForm({ firstName: '', lastName: '', email: '', phone: '', orderNumber: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src={heroImg} alt="Contact Trendora" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Contact Us</span>
            </div>

            <h1 className={styles.heroTitle}>
              We'd Love to <span className={styles.heroTitleEm}>Hear From You</span>
            </h1>

            <p className={styles.heroIntro}>
              Whether you have a question about an order, want to partner with us, or just want to say hello, our team is always ready to help.
            </p>

            {/* Quick Contact Cards */}
            <div className={styles.heroCards}>
              {contactChannels.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className={styles.heroCard}>
                    <div className={styles.heroCardIcon}>
                      <Icon size={20} />
                    </div>
                    <div className={styles.heroCardContent}>
                      <span className={styles.heroCardTitle}>{item.title}</span>
                      <span className={styles.heroCardDetail}>{item.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Response Time Card */}
          <div className={styles.heroRight}>
            <div className={styles.responseCard}>
              <div className={styles.responseIcon}>
                <Headphones size={32} />
              </div>
              <h3 className={styles.responseTitle}>Fast Response Guarantee</h3>
              <p className={styles.responseDesc}>
                Our team typically responds within 2 hours during business hours. For urgent matters, use our live chat.
              </p>
              <div className={styles.responseStats}>
                <div className={styles.responseStat}>
                  <span className={styles.responseStatValue}>2hrs</span>
                  <span className={styles.responseStatLabel}>Avg Response</span>
                </div>
                <div className={styles.responseStat}>
                  <span className={styles.responseStatValue}>24/7</span>
                  <span className={styles.responseStatLabel}>Live Chat</span>
                </div>
                <div className={styles.responseStat}>
                  <span className={styles.responseStatValue}>98%</span>
                  <span className={styles.responseStatLabel}>Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.mainGrid}>
            {/* Left - Contact Form */}
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.pillTag}>Send a Message</span>
                <h2 className={styles.formTitle}>
                  Tell Us What's <span className={styles.formTitleEm}>On Your Mind</span>
                </h2>
                <p className={styles.formDesc}>
                  Fill out the form and a real Trendora team member will get back to you. No bots, no scripts, just genuine help.
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="e.g. Amara"
                      className={styles.formInput}
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="e.g. Kofi"
                      className={styles.formInput}
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={styles.formInput}
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+237 600 000 000"
                      className={styles.formInput}
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>What is this about?</label>
                  <div className={styles.topicGrid}>
                    {topicOptions.map((topic) => {
                      const Icon = topic.icon;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`${styles.topicBtn} ${selectedTopic === topic.id ? styles.topicBtnActive : ''}`}
                        >
                          <Icon size={16} />
                          <span>{topic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="orderNumber">
                    Order Number <span className={styles.formLabelOptional}>(optional)</span>
                  </label>
                    <input
                      id="orderNumber"
                      type="text"
                      placeholder="e.g. TRD-20261234"
                      className={styles.formInput}
                      value={form.orderNumber}
                      onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="6"
                    placeholder="Describe your issue or question in as much detail as possible..."
                    className={styles.formTextarea}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>
                    <Send size={16} />
                    Send Message
                  </button>
                  <p className={styles.formNote}>
                    We typically respond within 2 hours during business hours.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side */}
            <div className={styles.sidebar}>
              {/* Business Hours Card */}
              <div className={styles.hoursCard}>
                <div className={styles.hoursHeader}>
                  <Clock size={20} />
                  <h3>Business Hours</h3>
                </div>
                <div className={styles.hoursList}>
                  {businessHours.map((item) => (
                    <div key={item.day} className={styles.hoursItem}>
                      <span className={styles.hoursDay}>{item.day}</span>
                      <span className={`${styles.hoursTime} ${!item.active ? styles.hoursTimeClosed : ''}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.hoursBadge}>
                  <span className={styles.hoursBadgeDot} />
                  Live Chat available 24/7
                </div>
              </div>

              {/* Location Card */}
              <div className={styles.locationCard}>
                <div className={styles.locationIcon}>
                  <MapPin size={24} />
                </div>
                <h3 className={styles.locationTitle}>Our Headquarters</h3>
                <p className={styles.locationAddress}>
                  Trendora HQ, Molyko Checkpoint<br />
                  Buea, Cameroon
                </p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className={styles.locationLink}>
                  View on Map
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Social Media Card */}
              <div className={styles.socialCard}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <p className={styles.socialDesc}>
                  Stay connected for updates, deals, and more.
                </p>
                <div className={styles.socialGrid}>
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.socialLink}
                        aria-label={social.label}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
      <section className={styles.channelsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.pillTag}>How We Can Help</span>
            <h2 className={styles.sectionTitle}>
              Choose Your <span className={styles.sectionTitleEm}>Support Channel</span>
            </h2>
            <p className={styles.sectionDesc}>
              Pick whichever way works best for you. We're available on all of them.
            </p>
          </div>

          <div className={styles.channelsGrid}>
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  className={styles.channelCard}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <div className={styles.channelIcon} style={{ background: `${channel.color}15`, color: channel.color }}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.channelTitle}>{channel.title}</h3>
                  <p className={styles.channelDesc}>{channel.description}</p>
                  <span className={styles.channelAction} style={{ color: channel.color }}>
                    {channel.action}
                    <ArrowRight size={16} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.pillTag}>FAQ</span>
            <h2 className={styles.sectionTitle}>
              Frequently Asked <span className={styles.sectionTitleEm}>Questions</span>
            </h2>
            <p className={styles.sectionDesc}>
              Can't find what you're looking for? Send us a message above.
            </p>
          </div>

          <div className={styles.faqGrid}>
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className={`${styles.faqCard} ${openFaq === index ? styles.faqCardOpen : ''}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={styles.faqQuestion}
                >
                  <span>{item.question}</span>
                  <div className={`${styles.faqIcon} ${openFaq === index ? styles.faqIconOpen : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Ready to Shop?
                <span className={styles.ctaTitleEm}>Explore Our Collection</span>
              </h2>
              <p className={styles.ctaDesc}>
                Discover thousands of quality products at affordable prices.
              </p>
            </div>
            <div className={styles.ctaButtons}>
              <Link to="/catalog" className={styles.ctaBtnPrimary}>
                Browse Catalog
                <ArrowRight size={16} />
              </Link>
              <Link to="/return-policy" className={styles.ctaBtnSecondary}>
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}