import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import Address from "../domain/value-object/address.value-object";

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
