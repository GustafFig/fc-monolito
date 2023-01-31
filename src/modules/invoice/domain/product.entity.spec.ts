import Product from "./product.entity";

const createProduct = (over: {}) => {
  return new Product({
    name: 'Product 1',
    price: 100,
    ...over,
  });
}

describe("product Entity", () => {
  it("should be possible to create an product with automagically id, createdAt", async () => {
    const product = createProduct({});

    expect(product.id.id).toBeDefined();
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });

  it("should throw an Error if name is invalid", async () => {
    expect(() => createProduct({ name: "" })).toThrow("Name is required");
  });

  it("should throw an Error if price is invalid", async () => {
    expect(() => createProduct({ price: "" })).toThrow("Price must be bigger than 0");
  });
});
