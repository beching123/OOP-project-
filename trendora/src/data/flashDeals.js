import flashPlaystation from '../assets/images resouces/electronics/playstation.jpeg';
import flashWasher from '../assets/images resouces/electronics/washing machine.jpeg';
import flashFridge from '../assets/images resouces/electronics/boiler.jpeg';
import flashOven from '../assets/images resouces/electronics/oven.jpeg';

export const FLASH_DEALS = [
  {
    id: 'flash-1',
    name: 'PlayStation Bundle',
    subtitle: 'Game night ready with a clean, high-energy setup.',
    category: 'Gaming',
    image: flashPlaystation,
    price: 210000,
    salePrice: 176000,
    badge: 'Top Deal',
  },
  {
    id: 'flash-2',
    name: 'Family Wash Pro',
    subtitle: 'Reliable laundry performance for everyday household use.',
    category: 'Home Care',
    image: flashWasher,
    price: 124000,
    salePrice: 101000,
    badge: 'Limited Drop',
  },
  {
    id: 'flash-3',
    name: 'Modern Kitchen Microwave',
    subtitle: 'A dependable kitchen upgrade with a polished finish.',
    category: 'Home Living',
    image: flashOven,
    price: 158000,
    salePrice: 129000,
    badge: 'Kitchen Pick',
  },
  {
    id: 'flash-4',
    name: 'Premium Cooling Unit',
    subtitle: 'A strong everyday appliance for reliable comfort.',
    category: 'Home Living',
    image: flashFridge,
    price: 196000,
    salePrice: 165000,
    badge: 'Big Save',
  },
];
