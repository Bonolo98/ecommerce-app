export class Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  category_id: string;
  created_at: number;
  is_deleted: number;

  constructor(
    id: number,
    name: string,
    price: number,
    stock: number,
    description: string,
    image_url: string,
    category_id: string,
    created_at: number,
    is_deleted: number
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.description = description;
    this.image_url = image_url;
    this.category_id = category_id;
    this.created_at = created_at;
    this.is_deleted = is_deleted;
  }
}
