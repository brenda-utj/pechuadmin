export interface Configuracion {
  bajarBarrasAntes: boolean;
  cerrarSinDeposito: boolean;
  claveGastos: boolean;
  tipo: string;
  numeroCopiasCorte: number;
  cajaMaxima?: any; // Asigna un tipo específico según tus necesidades
  tiempoCoccionPollo: number;
  cantidadDePreparado?: any; // Asigna un tipo específico según tus necesidades
  materiaTaco: string;
  mezclaPorTaco: number;
  authIn: boolean;
  authOut: boolean;
  authTransfer: boolean;
}
