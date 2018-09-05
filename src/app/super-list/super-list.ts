import { Item } from './item';

export interface SuperList {
  id: string;
  name: string;
  description: string;
  items: Item[];
}
