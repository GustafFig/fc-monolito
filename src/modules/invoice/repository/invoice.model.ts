import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InvoiceProductModel } from "./invoice-product.model";
import { ProductModel } from "./product.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false, field: "zip_code" })
  zipCode: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;

  @BelongsToMany(() => ProductModel, () => InvoiceProductModel, "invoice_id", "product_id")
  products: Array<ProductModel & {InvoiceProduct: InvoiceProductModel}>;

  @HasMany(() => InvoiceProductModel)
  invoiceProducts: InvoiceProductModel[];

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;

}
