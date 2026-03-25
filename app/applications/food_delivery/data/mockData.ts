import { categories, brand, sale, user } from '@/assets/icons';

export const mockCategories = [
  { id: 1, name: 'Classic', icon: categories },
  { id: 2, name: 'Special', icon: brand },
  { id: 3, name: 'PJ Sidekick', icon: sale },
];

export const mockBanners = [
  {
    id: 1,
    title: 'Mega Tuesday!',
    description: 'Get one medium pizza free Buy 2 Get 1 Free',
    image: require('@/assets/images/supermarket_banner.jpg'),
    backgroundColor: '#008435',
  },
];

export const mockProducts = [
  {
    id: 1,
    name: 'Crispy Wings and Chi...',
    rating: 4.0,
    reviews: 201,
    price: 5500.00,
    image: require('@/assets/images/supermarket.jpg'),
    ordersRecently: 10,
  },
  {
    id: 2,
    name: 'BBQ Wings and Chips',
    rating: 3.0,
    reviews: 122,
    price: 7500.55,
    image: require('@/assets/images/wholesales.jpg'),
    ordersRecently: 8,
  },
];

export const userProfile = {
  name: 'Jenny',
  location: 'Lekki, Lagos',
  avatar: user,
};


