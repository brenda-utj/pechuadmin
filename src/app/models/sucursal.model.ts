import { Configuracion } from "../components/sucursal/addsucursal/configuracion.interface";

export class Sucursal {
  _id?: string;
  name: string;
  zona: string;
  hora_cierre?: string;
  ticketHeader: string;
  ticketFooter: string;
  configuracion: Configuracion;
  materiaTaco: string;
  online: Number;
  activo: Number;
}
