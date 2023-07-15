import { BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceProductModel } from "./invoice-product.model";
import { InvoiceModel } from "./invoice.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @BelongsToMany(() => InvoiceModel, () => InvoiceProductModel, "product_id", "invoice_id")
  invoices: Array<InvoiceModel & {InvoiceProduct: InvoiceProductModel}>;
}
