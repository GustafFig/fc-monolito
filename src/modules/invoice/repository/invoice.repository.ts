import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceProductModel } from "./invoice-product.model";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoice: Invoice): Promise<void> {
    try {
      await InvoiceModel.sequelize.transaction(async (t) => {
        await InvoiceModel.create({
          id: invoice.id.id,
          name: invoice.name,
          document: invoice.document,
          street: invoice.address.street,
          state: invoice.address.state,
          city: invoice.address.city,
          zipCode: invoice.address.zipCode,
          number: invoice.address.number,
          complement: invoice.address.complement,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        }, { transaction: t });
        const invoiceProducts = invoice.items.map((item) => ({
          productId: item.id.id,
          salesPrice: item.price,
          name: item.name,
          invoiceId: invoice.id.id,
        }));
        await InvoiceProductModel.bulkCreate(invoiceProducts, { transaction: t });
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceProductModel, ProductModel],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        city: invoice.city,
        complement: invoice.complement,
        number: invoice.number,
        state: invoice.state,
        street: invoice.street,
        zipCode: invoice.zipCode,
      }),
      items: invoice.invoiceProducts.map((item) => new Product({
        id: new Id(String(item.productId)),
        name: item.name,
        price: item.salesPrice,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
