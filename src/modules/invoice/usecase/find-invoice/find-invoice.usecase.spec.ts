import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const MockRepoistory = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Find Invoice Use Case", () => {
  test("should return an invoice founded by repository", async () => {
    const repository = MockRepoistory();
    // creates an factory that creates invoices
    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice 1",
      document: "123.456.789-12",
      address: new Address({
        city: "city 1",
        complement: "123",
        number: "123",
        state: "FU",
        street: "Street 1",
        zipCode: "123443-123",
      }),
      items: [new Product({ name: "Product 1", price: 10 })],
    });
    repository.find.mockReturnValue(Promise.resolve(invoice));

    const findInvoiceUseCase = new FindInvoiceUseCase(repository);

    const result = await findInvoiceUseCase.execute({ id: "1" });
    expect(result.id).toBe("1");
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.city).toStrictEqual(invoice.address.city);
    expect(result.address.complement).toStrictEqual(invoice.address.complement);
    expect(result.address.number).toStrictEqual(invoice.address.number);
    expect(result.address.state).toStrictEqual(invoice.address.state);
    expect(result.address.zipCode).toStrictEqual(invoice.address.zipCode);
    expect(result.items[0].name).toStrictEqual(invoice.items[0].name);
    expect(result.items[0].price).toStrictEqual(invoice.items[0].price);
  });

  test("should throw error if invoice not founded", async () => {
    const repository = MockRepoistory();
    // creates an factory that creates invoices

    const findInvoiceUseCase = new FindInvoiceUseCase(repository);

    await expect(() =>
      findInvoiceUseCase.execute({ id: "1" })
    ).rejects.toThrowError("Invoice not founded");
  });

  test("should throw error if repository throws some unexpected error", async () => {
    const repository = MockRepoistory();
    // creates an factory that creates invoices
    const findInvoiceUseCase = new FindInvoiceUseCase(repository);
    repository.find.mockRejectedValue(
      Error("Error de conexão com o banco de dados")
    );

    await expect(() => findInvoiceUseCase.execute({ id: "1" })).rejects.toThrowError(
      "Unexpected Error"
    );
  });
});
