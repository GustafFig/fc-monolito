import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceRepository from "./invoice.repository";
import { ProductModel } from "./product.model";
import { InvoiceModel } from "./invoice.model";
import Product from "../domain/product.entity";
import { InvoiceProductModel } from "./invoice-product.model";

function compareInvoiceEntityToDb(invoice: Invoice, invoiceDb: InvoiceModel) {
  expect(invoiceDb).toBeDefined();
  expect(invoiceDb.id).toBe(invoice.id.id);
  expect(invoiceDb.name).toBe(invoice.name);
  expect(invoiceDb.document).toBe(invoice.document);
  expect(invoiceDb.street).toBe(invoice.address.street);
  expect(invoiceDb.number).toBe(invoice.address.number);
  expect(invoiceDb.complement).toBe(invoice.address.complement);
  expect(invoiceDb.city).toBe(invoice.address.city);
  expect(invoiceDb.state).toBe(invoice.address.state);
  expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
  expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
  expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);
}

function getProducts() {
  return [
    new Product({
      id: new Id("1"),
      name: "Product 1",
      price: 10,
    }),
    new Product({
      id: new Id("2"),
      name: "Product 2",
      price: 10,
    }),
  ];
}

async function saveProducts(items: Product[]) {
  return Promise.all(
    items.map(
      async (item) =>
        await ProductModel.create({
          id: item.id.id,
          name: item.name,
          salesPrice: item.price,
        })
    )
  );
}

function invoiceFactory(
  optInvoice: Partial<Invoice>,
  optAddress: Partial<Address>,
  products: Product[]
) {
  const address = new Address({
    street: "Address 1",
    number: "1",
    complement: "Complement",
    city: "City",
    state: "State",
    zipCode: "ZipCode",
    ...optAddress,
  });

  return new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document: "Document",
    address: address,
    items: products,
    ...optInvoice,
  });
}

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ProductModel, InvoiceProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const items = getProducts();
    const invoice = invoiceFactory({}, {}, items);
    await saveProducts(items);

    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } });

    compareInvoiceEntityToDb(invoice, invoiceDb);
  });

  it("should find a invoice", async () => {
    const items = getProducts();
    const invoiceCreate = invoiceFactory({}, {}, items);
    await saveProducts(items);

    const repository = new InvoiceRepository();
    await repository.add(invoiceCreate);

    const invoice = await repository.find(invoiceCreate.id.id);
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceCreate.id.id },
    });

    compareInvoiceEntityToDb(invoice, invoiceDb);
  });
});
