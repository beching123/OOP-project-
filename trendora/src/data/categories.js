import elecImg from '../assets/images resouces/electronics/speckers.jpeg';
import fashImg from '../assets/images resouces/clothe/women bags/bag5.jpeg';
import homeImg from '../assets/images resouces/house furnitures/chair5.jpeg';
import beauImg from '../assets/images resouces/perfume/perfume3.jpeg';
import sportImg from '../assets/images resouces/sport bike.jpeg';

export const mockCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Phones, TVs, laptops and accessories',
    image: elecImg,
    itemCount: 154,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing, shoes and accessories for men and women',
    image: fashImg,
    itemCount: 342,
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    description: 'Furniture, decor and kitchen appliances',
    image: homeImg,
    itemCount: 89,
  },
  {
    id: 'beauty-health',
    name: 'Beauty & Health',
    description: 'Skincare, makeup, and wellness products',
    image: beauImg,
    itemCount: 120,
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness equipment and sportswear',
    image: sportImg,
    itemCount: 65,
  },
];
