export class MenuItem {
  // tslint:disable-next-line:variable-name
  _id?: string;
  name: string;
  sucursal: string;
  product: string;
  needCupon: boolean;
  productQty: number;
  isPackage: boolean;
  esComplemento: boolean;
  disponibilidad: boolean;
  startDate: Date;
  endDate: Date;
  days: Array<any>; // aquí sería mandar el array de numeros [1,2,3,4,5,6,7]
  complementos: number;
  extras: Array<any>;
  sellPrice: number;
  secundaryPrices?: Array<any>;
  category: any;
  photo: string;
  position:number;
  onlyWithChicken:number;
}
