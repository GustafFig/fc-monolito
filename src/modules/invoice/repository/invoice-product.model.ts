import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

@Table({
  tableName: "invoice_products",
  timestamps: false,
})
export class InvoiceProductModel extends Model {
  @PrimaryKey
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false, field: "invoice_id" })
  invoiceId: number;

  @PrimaryKey
  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false, field: "product_id" })
  productId: number;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  salesPrice: number;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
