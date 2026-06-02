// Product categories
export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'home-living', name: 'Home & Living', icon: 'Home' },
  { id: 'beauty-health', name: 'Beauty & Health', icon: 'Heart' },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell' },
];

// Order statuses
export const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING_VERIFICATION: 'pending_verification',
  PAID: 'paid',
  SHIPPED: 'shipped',
  VOID: 'void',
};

// Delivery methods
export const DELIVERY_METHODS = {
  CHECKPOINT: 'checkpoint',
  DIRECT_PICKUP: 'direct_pickup',
  INTERNATIONAL: 'international',
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'mtn_momo', name: 'MTN Mobile Money', icon: 'Smartphone' },
  { id: 'orange_money', name: 'Orange Money', icon: 'Smartphone' },
  { id: 'bank_card', name: 'Bank Card', icon: 'CreditCard' },
  { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: 'Banknote' },
];

export const getPaymentMethodById = (id) => PAYMENT_METHODS.find((m) => m.id === id);

// Ticket statuses
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Ticket priorities
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
};

// Cameroon regions for address forms
export const CAMEROON_REGIONS = [
  'South-West',
  'North-West',
  'Littoral',
  'Centre',
  'West',
  'East',
  'South',
  'North',
  'Adamawa',
  'Far North',
];

// Checkpoints organized by city
export const CHECKPOINTS_BY_CITY = {
  // South-West
  'Buea': [
    { id: 'molyko', name: 'Molyko Checkpoint', description: 'Near University of Buea main gate' },
    { id: 'bonduma', name: 'Bonduma Checkpoint', description: 'Bonduma junction, main road' },
    { id: 'buea-town', name: 'Buea Town Checkpoint', description: 'Buea town center, opposite market' },
    { id: 'mile17', name: 'Mile 17 Checkpoint', description: 'Mile 17 motor park area' },
    { id: 'muea', name: 'Muea Checkpoint', description: 'Muea junction, close to Muea market' },
    { id: 'soppo', name: 'Soppo Checkpoint', description: 'Soppo main road, near police station' },
  ],
  'Limbe': [
    { id: 'limbe-central', name: 'Limbe Central Checkpoint', description: 'Limbe downtown, near market square' },
    { id: 'limbe-beach', name: 'Limbe Beach Road Checkpoint', description: 'Beach road, near the ocean front' },
    { id: 'limbe-down-beach', name: 'Down Beach Checkpoint', description: 'Down Beach area, near fish market' },
    { id: 'limbe-german', name: 'German Quarter Checkpoint', description: 'German quarters, main junction' },
  ],
  'Kumba': [
    { id: 'kumba-mbi', name: 'Kumba Mbi Checkpoint', description: 'Kumba Mbi junction, main road' },
    { id: 'kumba-town', name: 'Kumba Town Center', description: 'Kumba town center, opposite park' },
    { id: 'kumba-kelle', name: 'Kelle Checkpoint', description: 'Kelle junction, near market' },
  ],
  'Mamfe': [
    { id: 'mamfe-central', name: 'Mamfe Central Checkpoint', description: 'Mamfe town center, main road' },
    { id: 'mamfe-bridge', name: 'Mamfe Bridge Checkpoint', description: 'Near old bridge, riverside' },
  ],
  'Tiko': [
    { id: 'tiko-town', name: 'Tiko Town Checkpoint', description: 'Tiko town center, near motor park' },
    { id: 'tiko-down', name: 'Tiko Down Bay Checkpoint', description: 'Down Bay area, close to port' },
  ],
  // North-West
  'Bamenda': [
    { id: 'bamenda-commercial', name: 'Commercial Avenue Checkpoint', description: 'Commercial Avenue, city center' },
    { id: 'bamenda-ntiggeh', name: 'Ntiggeh Junction Checkpoint', description: 'Ntiggeh junction, main road' },
    { id: 'bamenda-ados', name: 'Ados Park Checkpoint', description: 'Ados Park area, near motor park' },
    { id: 'bamenda-up-station', name: 'Up Station Checkpoint', description: 'Up Station, near administrative area' },
    { id: 'bamenda-nkwen', name: 'Nkwen Checkpoint', description: 'Nkwen village, main junction' },
  ],
  'Bafoussam': [
    { id: 'bafoussam-central', name: 'Bafoussam Central Checkpoint', description: 'Bafoussam town center, near main market' },
    { id: 'bafoussam-marche', name: 'Marche A Checkpoint', description: 'Marche A, near the main market' },
    { id: 'bafoussam-mankon', name: 'Mankon Junction Checkpoint', description: 'Mankon junction, Ring Road' },
  ],
  'Nkambe': [
    { id: 'nkambe-central', name: 'Nkambe Central Checkpoint', description: 'Nkambe town center, main road' },
    { id: 'nkambe-ambon', name: 'Ambon Checkpoint', description: 'Ambon junction, near park' },
  ],
  'Wum': [
    { id: 'wum-central', name: 'Wum Central Checkpoint', description: 'Wum town center, opposite market' },
    { id: 'wum-fotouni', name: 'Fotouni Checkpoint', description: 'Fotouni junction, main road' },
  ],
  'Fundong': [
    { id: 'fundong-central', name: 'Fundong Central Checkpoint', description: 'Fundong town center, near park' },
    { id: 'fundong-njinikom', name: 'Njinikom Checkpoint', description: 'Njinikom junction, main road' },
  ],
  // Littoral
  'Douala': [
    { id: 'douala-bonanjo', name: 'Bonanjo Checkpoint', description: 'Bonanjo, near city hall' },
    { id: 'douala-akwa', name: 'Akwa Checkpoint', description: 'Akwa, near Bonapriso junction' },
    { id: 'douala-bepanda', name: 'Bepanda Checkpoint', description: 'Bepanda, near express junction' },
    { id: 'douala-deido', name: 'Deido Checkpoint', description: 'Deido, near motor park' },
    { id: 'douala-bonassama', name: 'Bonassama Checkpoint', description: 'Bonassama, near market' },
    { id: 'douala-nsap', name: 'Nsap Junction Checkpoint', description: 'Nsap junction, main road' },
  ],
  'Edéa': [
    { id: 'edea-central', name: 'Edéa Central Checkpoint', description: 'Edéa town center, near market' },
    { id: 'edea-soa', name: 'Soa Checkpoint', description: 'Soa junction, main road' },
  ],
  'Nkongsamba': [
    { id: 'nkongsamba-central', name: 'Nkongsamba Central Checkpoint', description: 'Town center, near main park' },
    { id: 'nkongsamba-melung', name: 'Melung Checkpoint', description: 'Melung junction, main road' },
  ],
  // Centre
  'Yaoundé': [
    { id: 'yaounde-central', name: 'Yaoundé Central Checkpoint', description: 'Centre commercial, near marche central' },
    { id: 'yaounde-bastos', name: 'Bastos Checkpoint', description: 'Bastos, near embassy road' },
    { id: 'yaounde-nsim', name: 'Nsim Checkpoint', description: 'Nsim, near motor park' },
    { id: 'yaounde-ekoundou', name: 'Ekoundou Checkpoint', description: 'Ekoundou, near main junction' },
    { id: 'yaounde-mimboman', name: 'Mimboman Checkpoint', description: 'Mimboman, near索opérino' },
    { id: 'yaounde-obi', name: 'Obi Ndi Checkpoint', description: 'Obi Ndi, main crossroads' },
  ],
  'Mbalmayo': [
    { id: 'mbalmayo-central', name: 'Mbalmayo Central Checkpoint', description: 'Mbalmayo town center, near market' },
    { id: 'mbalmayo-nyong', name: 'Nyong Checkpoint', description: 'Nyong junction, main road' },
  ],
  'Ebolowa': [
    { id: 'ebolowa-central', name: 'Ebolowa Central Checkpoint', description: 'Ebolowa town center, near park' },
    { id: 'ebolowa-mvog-mbi', name: 'Mvog Mbi Checkpoint', description: 'Mvog Mbi junction, main road' },
  ],
  // West
  'Dschang': [
    { id: 'dschang-central', name: 'Dschang Central Checkpoint', description: 'Dschang town center, near university' },
    { id: 'dschang-marche', name: 'Marché B Checkpoint', description: 'Marché B, near main market' },
  ],
  'Bamendjou': [
    { id: 'bamendjou-central', name: 'Bamendjou Central Checkpoint', description: 'Bamendjou town center, main road' },
  ],
  'Foumban': [
    { id: 'foumban-central', name: 'Foumban Central Checkpoint', description: 'Foumban town center, near palace' },
    { id: 'foumban-marche', name: 'Foumban Market Checkpoint', description: 'Near main market, central area' },
  ],
  // East
  'Bertoua': [
    { id: 'bertoua-central', name: 'Bertoua Central Checkpoint', description: 'Bertoua town center, near park' },
    { id: 'bertoua-azire', name: 'Azire Checkpoint', description: 'Azire junction, main road' },
  ],
  // South
  'Kribi': [
    { id: 'kribi-central', name: 'Kribi Central Checkpoint', description: 'Kribi town center, near beach road' },
    { id: 'kribi-lobé', name: 'Lobé Checkpoint', description: 'Lobé, near waterfall road' },
  ],
  // North
  'Garoua': [
    { id: 'garoua-central', name: 'Garoua Central Checkpoint', description: 'Garoua town center, near main park' },
    { id: 'garoua-djamboutou', name: 'Djamboutou Checkpoint', description: 'Djamboutou junction, main road' },
  ],
  'Maroua': [
    { id: 'maroua-central', name: 'Maroua Central Checkpoint', description: 'Maroua town center, near main market' },
    { id: 'maroua-pettaw', name: 'Pettaw Checkpoint', description: 'Pettaw junction, main road' },
  ],
  'Ngaoundéré': [
    { id: 'ngaoundere-central', name: 'Ngaoundéré Central Checkpoint', description: 'Ngaoundéré town center, near station' },
    { id: 'ngaoundere-rey', name: 'Rey Checkpoint', description: 'Rey junction, main road' },
  ],
  // Adamawa
  'Tignère': [
    { id: 'tignere-central', name: 'Tignère Central Checkpoint', description: 'Tignère town center, main road' },
  ],
  'Meiganga': [
    { id: 'meiganga-central', name: 'Meiganga Central Checkpoint', description: 'Meiganga town center, near park' },
  ],
  'Banyo': [
    { id: 'banyo-central', name: 'Banyo Central Checkpoint', description: 'Banyo town center, main road' },
  ],
  // Far North
  'Kousséri': [
    { id: 'kousseri-central', name: 'Kousséri Central Checkpoint', description: 'Kousséri town center, near border' },
    { id: 'kousseri-marche', name: 'Kousséri Market Checkpoint', description: 'Near main market, central area' },
  ],
  'Yagoua': [
    { id: 'yagoua-central', name: 'Yagoua Central Checkpoint', description: 'Yagoua town center, main road' },
  ],
  'Mokolo': [
    { id: 'mokolo-central', name: 'Mokolo Central Checkpoint', description: 'Mokolo town center, near market' },
  ],
};

// Get checkpoints for a given city
export const getCheckpointsByCity = (city) => {
  return CHECKPOINTS_BY_CITY[city] || [];
};

// Fallback checkpoints (Buea) for backwards compatibility
export const CHECKPOINTS = CHECKPOINTS_BY_CITY['Buea'];

// Shipping costs by region
export const SHIPPING_RATES = {
  BUEA: 1000,
  OUTSIDE_BUEA: 2000,
  INTERNATIONAL: 5000,
  FREE_THRESHOLD: 50000,
};

// Read admin-set rates from localStorage (shared with admin panel)
const getAdminSettings = () => {
  try {
    const raw = localStorage.getItem('trendora-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.state || parsed;
    }
  } catch {}
  return null;
};

// Region-based shipping rates (distance from Buea)
export const REGION_SHIPPING_RATES = {
  'South-West': 1000,    // Within Buea/South-West
  'Littoral': 2000,      // Douala, Limbe nearby
  'West': 2500,          // Bafoussam, Dschang
  'Centre': 3000,        // Yaoundé
  'North-West': 2500,    // Bamenda
  'South': 3000,         // Ebolowa, Kribi
  'East': 3500,          // Bertoua
  'Adamawa': 3500,       // Ngaoundéré
  'North': 4000,         // Garoua, Maroua
  'Far North': 4000,     // Kousséri, Yagoua
};

// Get shipping cost based on region and city
export const getShippingCost = (region, city, subtotal = 0) => {
  const admin = getAdminSettings();
  const threshold = admin?.freeShippingThreshold ?? SHIPPING_RATES.FREE_THRESHOLD;
  if (threshold > 0 && subtotal >= threshold) return 0;

  // Check admin-set per-region rates first
  if (admin?.shippingRates) {
    if (region === 'South-West' && city === 'Buea') {
      const match = admin.shippingRates.find(r => r.region === 'South-West (Buea)');
      return match ? match.fee : SHIPPING_RATES.BUEA;
    }
    if (region === 'South-West') {
      const match = admin.shippingRates.find(r => r.region === 'South-West (Other)');
      return match ? match.fee : SHIPPING_RATES.OUTSIDE_BUEA;
    }
    const regionMap = {
      'Littoral': 'Littoral', 'West': 'West', 'North-West': 'North-West',
      'Centre': 'Centre', 'South': 'South', 'East': 'East',
      'Adamawa': 'Adamawa', 'North': 'North', 'Far North': 'Far North',
    };
    const adminRegion = regionMap[region];
    if (adminRegion) {
      const match = admin.shippingRates.find(r => r.region === adminRegion);
      if (match) return match.fee;
    }
  }

  // Fallback to hardcoded defaults
  if (region === 'international') return SHIPPING_RATES.INTERNATIONAL;
  if (region === 'South-West' && city === 'Buea') return SHIPPING_RATES.BUEA;
  return REGION_SHIPPING_RATES[region] || SHIPPING_RATES.OUTSIDE_BUEA;
};

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;
