import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { ProductModel } from "../repository/product.model";
import { InvoiceProductModel } from "../repository/invoice-product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

async function saveProducts(items: { id: string, name: string, price: number }[]) {
  return Promise.all(items.map((item) => ProductModel.create({
    id: item.id,
    name: item.name,
    salesPrice: item.price,
  })));
}

describe("ClientAdmFacade test", () => {
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

  it("should generate a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      name: "Client 1",
      document: "document",
      street: "Street 1",
      number: "123",
      complement: "123",
      city: "City 1",
      state: "State",
      zipCode: "ZipCode",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        }
      ]
    };

    await saveProducts(input.items);

    const result = await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: result.id },
      include: InvoiceProductModel,
    });

    expect(invoice).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);

    invoice.invoiceProducts.forEach((invoiceProduct) => 
      expect(input.items).toContainEqual({
        name: invoiceProduct.name,
        id: invoiceProduct.productId,
        price: invoiceProduct.salesPrice,
      })
    );

    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.street);
    expect(result.number).toBe(invoice.number);
    expect(result.complement).toBe(invoice.complement);
    expect(result.city).toBe(invoice.city);
    expect(result.state).toBe(invoice.state);
    expect(result.zipCode).toBe(invoice.zipCode);

    invoice.invoiceProducts.forEach((invoiceProduct) => 
    expect(result.items).toContainEqual({
      name: invoiceProduct.name,
      id: invoiceProduct.productId,
      price: invoiceProduct.salesPrice,
    })
  );

  });

  it("should find a client", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      name: "Client 1",
      document: "document",
      street: "Street 1",
      number: "123",
      complement: "123",
      city: "City 1",
      state: "State",
      zipCode: "ZipCode",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        }
      ]
    };

    await saveProducts(input.items);

    const result = await facade.generate(input);

    const output = await facade.find({ id: result.id });

    expect(output).toBeDefined();
    expect(output.id).toEqual(result.id);
    expect(output.name).toEqual(result.name);
    expect(output.address.street).toEqual(result.street);
    expect(output.address.city).toEqual(result.city);
    expect(output.address.complement).toEqual(result.complement);
    expect(output.address.number).toEqual(result.number);
    expect(output.address.state).toEqual(result.state);
    expect(output.address.zipCode).toEqual(result.zipCode);

    input.items.forEach((item) => 
      expect(output.items).toContainEqual({
        id: item.id,
        name: item.name,
        price: item.price,
      })
    );

  });
});
