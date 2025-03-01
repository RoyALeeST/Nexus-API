import { Product } from 'product/model/product.schema';
import { BusinessCategory } from '../enums/businessCategory.enum';
import { Sale } from 'sales/schema/sale.schema';

export class BusinessResponseDto {
  businessId: string;
  name: string;
  category: BusinessCategory;
  owner: string; // User ID
  products: Product[]; // Array of product objects
  sales: Sale[]; // Array of sale objects

  constructor(
    businessId: string,
    name: string,
    category: BusinessCategory,
    owner: string,
    products: Product[],
    sales: Sale[],
  ) {
    this.businessId = businessId;
    this.name = name;
    this.category = category;
    this.owner = owner;
    this.products = products;
    this.sales = sales;
  }
}
