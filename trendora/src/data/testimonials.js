const createAvatar = (initials, startColor, endColor) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)" />
      <circle cx="52" cy="48" r="26" fill="rgba(255,255,255,0.12)" />
      <circle cx="112" cy="116" r="34" fill="rgba(255,255,255,0.10)" />
      <text x="80" y="93" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const mockTestimonials = [
  {
    id: 't-1',
    name: 'Nche Emmanuel',
    role: 'Fashion Shopper',
    image: createAvatar('NE', '#0f766e', '#14b8a6'),
    rating: 5,
    text: 'Trendora makes it easy to find quality pieces that still feel affordable. The delivery was quick and the sneakers looked even better in person.',
    product: 'Men\'s Casual Sneakers',
  },
  {
    id: 't-2',
    name: 'Nabilah Nelly',
    role: 'Tech Buyer',
    image: createAvatar('NN', '#7c2d12', '#f97316'),
    rating: 5,
    text: 'The smartphone came neatly packaged and the price was way better than I expected. Solid value for the quality you get.',
    product: 'Smartphone Flagship',
  },
  {
    id: 't-3',
    name: 'Bessala Judith',
    role: 'Home Decor Lover',
    image: createAvatar('BJ', '#1d4ed8', '#60a5fa'),
    rating: 4,
    text: 'My living room feels upgraded with the sofa I ordered. Trendora kept the look premium without the premium price tag.',
    product: 'Modern Sofa',
  },
  {
    id: 't-4',
    name: 'Mbangwa Kevin',
    role: 'Beauty Enthusiast',
    image: createAvatar('MK', '#7e22ce', '#ec4899'),
    rating: 5,
    text: 'The skincare set is exactly what I wanted: gentle, effective, and affordable. I trust Trendora for quality now.',
    product: 'Skincare Complete Set',
  },
];
