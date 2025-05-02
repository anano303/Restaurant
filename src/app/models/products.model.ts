export interface Product {
  id: number;
  name: string;
  price: number;
  nuts: boolean;
  image: string;
  vegeterian: boolean; // Changed from vegetarian to vegeterian to match API
  spiciness: number;
  categoryId: number;
}
