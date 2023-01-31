import Invoice from "./invoice.entity";
import Product from "./product.entity";
import Address from "./value-object/address.value-object";

const createInvoice = (over: {}) => {
  return new Invoice({
    name: "Fake name",
    document: "123.456.789-12",
    address: new Address({
      city: "city 1",
      state: "state 1",
      zipCode: "zipCode 1",
      number: "1",
      complement: "332",
      street: "Street 231",
    }),
    items: [
      new Product({ name: "Product 1", price: 100 }),
      new Product({ name: "Product 2", price: 200 }),
    ],
    ...over,
  });
};

describe("Invoice Entity", () => {
  it("should be possible to create an invoice with automagically id, createdAt", async () => {
    const invoice = createInvoice({});

    expect(invoice.id.id).toBeDefined();
    expect(invoice.createdAt).toBeDefined();
    expect(invoice.updatedAt).toBeDefined();
  });

  it("should throw an Error if name is invalid", async () => {
    expect(() => createInvoice({ name: "" })).toThrow("Name is required");
  });

  it("should throw an Error if document is invalid", async () => {
    expect(() => createInvoice({ document: "" })).toThrow("Document is required");
  });

  it("should throw an Error if address is invalid", async () => {
    expect(() => createInvoice({ address: undefined })).toThrow("Address is required");
  });

  it("should throw an Error if items is empty", async () => {
    expect(() => createInvoice({ items: [] })).toThrow("Items must have at least 1 item");
  });
});
