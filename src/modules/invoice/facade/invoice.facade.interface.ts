import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../usecase/find-invoice/find-invoice.usecase.dto";

import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "../usecase/generate/generate-invoice.usecase.dto";

export interface FindInvoiceFacadeInputDTO extends FindInvoiceUseCaseInputDTO {}

export interface FindInvoiceFacadeOutputDTO
  extends FindInvoiceUseCaseOutputDTO {}

export interface GenerateInvoiceFacadeInputDto
  extends GenerateInvoiceUseCaseInputDto {}

export interface GenerateInvoiceFacadeOutputDto
  extends GenerateInvoiceUseCaseOutputDto {}

export default interface InvoiceFacadeInterface {
  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceFacadeOutputDTO>;
  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceUseCaseOutputDto>;
}
