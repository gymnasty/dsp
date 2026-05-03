export type Category = 'Components' | 'Buildings';

export interface Item {
  id: string;
  name: string;
  category: Category;
  description?: string;
  iconPath?: string;
}

export interface Ingredient {
  itemId: string;
  count: number;
}

export interface Recipe {
  id: string;
  outputItemId: string;
  outputCount: number;
  time: number; // in seconds
  ingredients: Ingredient[];
  producedIn: string;
}
