export interface Item {
  id?: number;
  name: string;
  amount: number;
  description: string;
  cost: number;
  done?: boolean;
  pictureUrl?: string;
  measure?: string; // מידה
}
