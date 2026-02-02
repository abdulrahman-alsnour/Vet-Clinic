import { atom } from 'recoil';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: [],
});
