import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "./value-object/address.value-object";
import Product from "./product.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;

    this.validate();
  }
  
  validate() {
    if (this._name.length === 0) {
      throw Error('Name is required')
    }
    if (this._document.length === 0) {
      throw Error('Document is required')
    }
    if (!this._address) {
      throw Error('Address is required')
    }
    if (this._items.length === 0) {
      throw Error('Items must have at least 1 item')
    }
  }

  get name() {
    return this._name;
  }

  get document() {
    return this._document;
  }

  get address() {
    return this._address;
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._items.reduce((acc, item) => item.price + acc, 0);
  }
}
