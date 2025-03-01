import { Product } from 'product/model/product.schema';
import { ProductCategory } from 'product/enum/productCategory.enum';
export class ProductResponseDto {
  private productId: string;
  private businessId: string;
  private name: string;
  private category: ProductCategory;
  private measurementType: string;
  private price: number;
  private unit: string;
  private initialQuantity: number;
  private currentQuantity: number;
  private description: string;

  constructor(product: Product) {
    this.productId = product.productId;
    this.name = product.name;
    this.category = product.category;
    this.measurementType = product.measurementType;
    this.price = product.price;
    this.unit = product.unit;
    this.initialQuantity = product.initialQuantity;
    this.currentQuantity = product.currentQuantity;
    this.description = product.description;
    this.businessId = product.business.businessId;
  }
}
