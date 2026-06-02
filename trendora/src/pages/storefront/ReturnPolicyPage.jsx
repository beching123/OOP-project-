import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
  XCircle,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import heroImg from '../../assets/images resouces/(1) Instagram.jfif';
import styles from './ReturnPolicyPage.module.css';

const policyHighlights = [
  {
    icon: RefreshCw,
    title: '30-Day Window',
    description: 'Most eligible items may be returned within 30 days of delivery.',
  },
  {
    icon: PackageCheck,
    title: 'Original Condition',
    description: 'Items should be unused, undamaged, and returned with original packaging.',
  },
  {
    icon: Truck,
    title: 'Easy Drop-Off',
    description: 'Return items through our Buea pickup point or delivery agent.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Refunds',
    description: 'Approved refunds are processed back to the original payment method.',
  },
];

const returnSteps = [
  {
    step: '01',
    title: 'Contact Support',
    description:
      'Email support@trendora.cm with your order number, reason for return, and a photo if the item arrived damaged.',
  },
  {
    step: '02',
    title: 'Get Approval',
    description:
      'Our team will review your request and confirm eligibility along with the preferred return method.',
  },
  {
    step: '03',
    title: 'Pack & Send',
    description:
      'Return the item in its original state and packaging through our Buea location or delivery handoff.',
  },
  {
    step: '04',
    title: 'Receive Refund',
    description:
      'Once received and inspected, approved refunds are issued within the stated processing timeframe.',
  },
];

const nonReturnableItems = [
  'Custom-made or personalised products',
  'Items that have been used, washed, or altered after delivery',
  'Perishable or hygiene-sensitive items that have been opened',
  'Items returned without proof of purchase',
];

const refundTimeline = [
  { day: '1-2 Days', label: 'Return Request', description: 'Submit your return request with order details' },
  { day: '3-5 Days', label: 'Ship Item Back', description: 'Pack and send the item via our pickup point' },
  { day: '5-7 Days', label: 'Quality Inspection', description: 'Our team inspects the returned item' },
  { day: '7-14 Days', label: 'Refund Issued', description: 'Refund processed to your original payment' },
];

const faqItems = [
  {
    question: 'How do I know if my item is eligible for return?',
    answer:
      'Most items purchased from Trendora are eligible for return within 30 days of delivery, provided they are in original condition. Custom-made or hygiene-sensitive items may not be eligible.',
  },
  {
    question: 'Do I need to pay for return shipping?',
    answer:
      'Return shipping costs vary depending on the reason. If the return is due to our error (damaged or defective item), we will cover the shipping costs.',
  },
  {
    question: 'Can I exchange an item instead of getting a refund?',
    answer:
      'Yes, in some cases we can arrange an exchange. Please contact our support team with your order details and we will help you with the best option.',
  },
  {
    question: 'What if my item arrived damaged?',
    answer:
      'If your item arrived damaged or defective, please contact us immediately with photos. We will arrange a return and provide a full refund or replacement.',
  },
  {
    question: 'How long does the refund process take?',
    answer:
      'Once we receive and inspect the returned item, refunds are typically processed within 7-14 business days to your original payment method.',
  },
];

export default function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero Section with Background Image */}
      <section className={styles.heroSection}>
        <img src={heroImg} alt="Trendora Return Policy" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Return Policy</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Return & Refunds Made <span className={styles.heroTitleEm}>Simple and Fair</span>
            </h1>
            
            <p className={styles.heroIntro}>
              At Trendora, we want every purchase to feel confident. If something is not right, our return process is designed to be simple, transparent, and easy to follow.
            </p>

            {/* Hero Stats */}
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Clock3 size={20} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>30 Days</span>
                  <span className={styles.statLabel}>Return Window</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <RefreshCw size={20} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>100%</span>
                  <span className={styles.statLabel}>Secure Refunds</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <ShieldCheck size={20} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>24/7</span>
                  <span className={styles.statLabel}>Support Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          <div className={styles.heroRight}>
            <div className={styles.heroPanel}>
              <div className={styles.heroPanelHeader}>
                <ShieldCheck size={28} />
                <span>Guaranteed Returns</span>
              </div>
              <div className={styles.heroPanelContent}>
                <h3 className={styles.heroPanelTitle}>Shop with Confidence</h3>
                <p className={styles.heroPanelText}>
                  Every purchase is backed by our hassle-free return policy. If you're not satisfied, we'll make it right.
                </p>
                <div className={styles.heroPanelFeatures}>
                  <div className={styles.heroPanelFeature}>
                    <CheckCircle size={16} />
                    <span>Easy 30-day returns</span>
                  </div>
                  <div className={styles.heroPanelFeature}>
                    <CheckCircle size={16} />
                    <span>Free return shipping</span>
                  </div>
                  <div className={styles.heroPanelFeature}>
                    <CheckCircle size={16} />
                    <span>Quick refund processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Highlights Section */}
      <section className={styles.highlightsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.pillTag}>Why Return with Us</span>
            <h2 className={styles.sectionTitle}>
              Hassle-Free Return <span className={styles.sectionTitleEm}>Guarantee</span>
            </h2>
            <p className={styles.sectionDesc}>
              We've designed our return process to be as smooth and straightforward as possible.
            </p>
          </div>

          <div className={styles.highlightsGrid}>
            {policyHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.highlightTitle}>{item.title}</h3>
                  <p className={styles.highlightDesc}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return Steps Section */}
      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.stepsGrid}>
            <div className={styles.stepsLeft}>
              <span className={styles.pillTag}>Return Guide</span>
              <h2 className={styles.sectionTitle}>
                How to Start a <span className={styles.sectionTitleEm}>Return</span>
              </h2>
              <p className={styles.sectionDesc}>
                Follow these simple steps to initiate your return and get a refund quickly.
              </p>

              <div className={styles.stepsList}>
                {returnSteps.map((item, index) => (
                  <div key={item.step} className={styles.stepCard}>
                    <div className={styles.stepNumber}>{item.step}</div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{item.title}</h3>
                      <p className={styles.stepDesc}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.stepsRight}>
              {/* Refund Timeline Card */}
              <div className={styles.timelineCard}>
                <div className={styles.timelineHeader}>
                  <Clock3 size={22} />
                  <h3>Refund Timeline</h3>
                </div>
                <div className={styles.timelineList}>
                  {refundTimeline.map((item, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineDay}>{item.day}</div>
                        <div className={styles.timelineLabel}>{item.label}</div>
                        <div className={styles.timelineDesc}>{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support Card */}
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <MessageCircle size={24} />
                </div>
                <h3 className={styles.contactTitle}>Need Help?</h3>
                <p className={styles.contactDesc}>
                  Our support team is ready to assist you with any return questions.
                </p>
                <div className={styles.contactMethods}>
                  <div className={styles.contactMethod}>
                    <Mail size={16} />
                    <span>support@trendora.cm</span>
                  </div>
                  <div className={styles.contactMethod}>
                    <Phone size={16} />
                    <span>+237 600 000 000</span>
                  </div>
                  <div className={styles.contactMethod}>
                    <MapPin size={16} />
                    <span>Molyko, Buea</span>
                  </div>
                </div>
                <Link to="/contact" className={styles.contactBtn}>
                  Contact Support
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions & Non-Returnable Section */}
      <section className={styles.conditionsSection}>
        <div className="container">
          <div className={styles.conditionsGrid}>
            {/* Return Conditions */}
            <div className={styles.conditionsCard}>
              <div className={styles.conditionsHeader}>
                <FileText size={22} />
                <h3>Return Conditions</h3>
              </div>
              <ul className={styles.conditionsList}>
                <li className={styles.conditionItem}>
                  <CheckCircle2 size={18} />
                  <span>Items should be unused, undamaged, and in original packaging</span>
                </li>
                <li className={styles.conditionItem}>
                  <CheckCircle2 size={18} />
                  <span>Keep your proof of purchase or order number ready</span>
                </li>
                <li className={styles.conditionItem}>
                  <CheckCircle2 size={18} />
                  <span>Returns outside the 30-day period may not be approved</span>
                </li>
                <li className={styles.conditionItem}>
                  <CheckCircle2 size={18} />
                  <span>Items must be returned with all original tags intact</span>
                </li>
              </ul>
            </div>

            {/* Non-Returnable Items */}
            <div className={styles.nonReturnableCard}>
              <div className={styles.nonReturnableHeader}>
                <AlertTriangle size={22} />
                <h3>Items That Cannot Be Returned</h3>
              </div>
              <ul className={styles.nonReturnableList}>
                {nonReturnableItems.map((item, index) => (
                  <li key={index} className={styles.nonReturnableItem}>
                    <XCircle size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
              Can't find what you're looking for? Contact our support team.
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

      {/* Bottom CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Still Have Questions?
                <span className={styles.ctaTitleEm}>We're Here to Help</span>
              </h2>
              <p className={styles.ctaDesc}>
                Our support team is standing by to help with returns, refunds, and any other questions you may have.
              </p>
            </div>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.ctaBtnPrimary}>
                <MessageCircle size={18} />
                Get in Touch
              </Link>
              <Link to="/catalog" className={styles.ctaBtnSecondary}>
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}