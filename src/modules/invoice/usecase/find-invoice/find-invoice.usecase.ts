import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    let invoice;
    try {
      invoice = await this._invoiceRepository.find(input.id);
    } catch (err) {
      // logic to save this error
      throw Error("Unexpected Error");
    }

    if (!invoice) {
      throw Error("Invoice not founded");
    }

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        number: invoice.address.number,
        complement: invoice.address.complement,
        street: invoice.address.street,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
      createdAt: invoice.createdAt,
    }
  }
}
