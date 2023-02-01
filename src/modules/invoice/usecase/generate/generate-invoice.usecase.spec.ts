import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../domain/value-object/address.value-object";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepoistory = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

const makeInput = (over: {}) => ({
  name: 'Invoice 1',
  document: '123456789-12',
  street: "Street 1",
  number: "123",
  complement: "123",
  city: "city 1",
  state: "FU",
  zipCode: "123443-123",
  items: [
    { id: "1", name: "Product 1", price: 10 },
    { id: "2", name: "Product 2", price: 20 },
  ],
  ...over
});

describe("Generate Invoice Use Case", () => {
  test("should create an invoice", async () => {
    const repository = MockRepoistory();
    const input = makeInput({});

    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);

    const result = await generateInvoiceUseCase.execute(input);
    expect(repository.add).toHaveBeenCalled();

    expect(result.id).toBeDefined();
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toContainEqual(input.items[0]);
    expect(result.items).toContainEqual(input.items[1]);
  });

  test("should throw error if miss invoice name or document", async () => {
    const repository = MockRepoistory();
    // creates an factory that creates invoices
    const inputNoName = makeInput({ name: '' });
    const inputNoDocument = makeInput({ document: '' });

    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);

    await expect(() =>
      generateInvoiceUseCase.execute(inputNoName)
    ).rejects.toThrowError("Name is required");
    await expect(() =>
      generateInvoiceUseCase.execute(inputNoDocument)
    ).rejects.toThrowError("Document is required");
  });

  describe('should throw error if miss invoice address info:', () => {
    test.each`
      field      |  error
      ${"street"}     | ${"Street is required"}
      ${"zipCode"}    | ${"Zip is required"}
      ${"state"}      | ${"State is required"}
      ${"city"}       | ${"City is required"}
      ${"complement"} | ${"Complement is required"}
      ${"number"}     | ${"Number is required"}
    `("miss $field should throw $error", async ({ field, error }) => {
      const repository = MockRepoistory();
      // creates an factory that creates invoices
      const input = makeInput({ [field]: '' });
      const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
  
      await expect(() =>
        generateInvoiceUseCase.execute(input)
      ).rejects.toThrowError(error);
    });
  });

  test("should throw error if repository throws some unexpected error", async () => {
    const repository = MockRepoistory();
    // creates an factory that creates invoices
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
    repository.add.mockRejectedValue(
      Error("Error de conexão com o banco de dados")
    );

    const input = makeInput({});
    await expect(() => generateInvoiceUseCase.execute(input)).rejects.toThrowError(
      "Unexpected Error"
    );
  });
});
