import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
    this._price = props.price;

    this.validate();
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._price <= 0) {
      throw new Error("Price must be bigger than 0");
    }
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }
}
