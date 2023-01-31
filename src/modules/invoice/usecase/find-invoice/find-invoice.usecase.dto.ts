// DTO Find
export interface FindInvoiceUseCaseInputDTO {
  id: string;
}

type Item = {
  id: string;
  name: string;
  price: number;
};

export interface FindInvoiceUseCaseOutputDTO {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Item[];
  total: number;
  createdAt: Date;
};
