import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ZonesService } from "src/app/services/zones.service";
import { Sucursal } from "src/app/models/sucursal.model";
import { AuthService } from "src/app/services/auth.service";
import { variables } from "../../variables";
import Swal from "sweetalert2";

@Component({
  selector: "app-addsucursal",
  templateUrl: "./addsucursal.component.html",
  styleUrls: ["./addsucursal.component.scss"],
})
export class AddsucursalComponent implements OnInit {
  zonas;
  user;
  sucursal: Sucursal;
  disableZona: boolean;
  opened: boolean;
  tipos;

  constructor(
    private sucursalSvc: ZonesService,
    private authSvc: AuthService,
    private dialogRef: MatDialogRef<AddsucursalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.sucursal = new Sucursal();
  }

  ngOnInit() {
    if (this.data !== null) {
      this.sucursal = this.data;
    } else {
      // Configuraciones predeterminadas para sucursales nuevas
      this.sucursal.ticketHeader = "Pollo Pechugón Rosticerías";
      this.sucursal.ticketFooter = "¡Gracias por su compra!\nTAN GRANDE COMO SU SABOR";
      this.sucursal.hora_cierre = "18:00";
      this.sucursal.online = 1;
      this.sucursal.activo = 1;

      this.sucursal.configuracion = {
        bajarBarrasAntes: false,
        cerrarSinDeposito: false,
        claveGastos: true,
        tipo: "Sucursal pollo",
        numeroCopiasCorte: 1,
        cajaMaxima: 1000, // Debes asignar un valor específico aquí, ya que no lo has proporcionado en tu código
        tiempoCoccionPollo: 110,
        cantidadDePreparado: 0.04, // Asigna un valor específico
        materiaTaco: "pollo",
        mezclaPorTaco: 0.028571,
        authIn: false,
        authOut: true,
        authTransfer: false,
      };
    }
    
    this.getUser();
    this.tipos = new variables().tiposDeSucursal;
  }

  getZonas(zones: string[]) {
    this.sucursalSvc.getZonas().subscribe((zonas) => {
      // this.zonas = zonas;

      if (this.user.role !== "super administrativo") {
        this.zonas = (zonas as unknown[]).filter((z) => {
          if (zones.indexOf(z["_id"]) !== -1) {
            return z;
          }
        });
      } else {
        this.zonas = zonas as unknown[];
      }

      // this.getUser();

      // if(this.zonas.lenght != 0) {
      //   this.selectedZone = zonas[0];
      //   this.loadRemote(zonas[0]._id);
      // }
    });
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getZonas(user["zonas"] !== undefined ? user.zonas : [user.zona]);

        if (this.zonas) {
          this.zonas.map((z) => {
            if (z._id === this.user.zona) {
              this.sucursal.zona = z._id;
            }
          });
        }
        switch (this.user.role) {
          case "super administrativo":
            this.disableZona = false;
            break;
          default:
          case "administrativo":
          case "rh de zona":
          case "auxiliar de zona":
          case "gerente":
          case "supervisor":
          case "encargado de sucursal":
            this.disableZona = true;
            break;
        }
      }
    });
  }

  addSucursal() {
    // Validar campos obligatorios
    if (!this.sucursal.zona || !this.sucursal.name) {
      return;
    }
  
    if (this.sucursal._id === undefined) {
      this.sucursalSvc.crearSucursal(this.sucursal).subscribe((sucursal) => {        
        // mostramos errores segun el caso
        if (sucursal) {
          // Mensaje
          Swal.fire({
            title: "Correcto",
            text: 'Se creó el registro correctamente',
            icon: "success",
            confirmButtonText: "OK",
            timer: 5000,
          });

          // Cerramos modal
          this.dialogRef.close();
        } else {
          // mensaje de error
          Swal.fire({
            title: "Error",
            text: "Ocurrio un error al crear el registro",
            icon: "error",
            confirmButtonText: "OK",
            timer: 5000,
          });
        }
      });
    } else {
      this.sucursalSvc.updateSucursal(this.sucursal).subscribe((updated) => {
        // mostramos errores segun el caso
        if (updated) {
          // Mensaje
          Swal.fire({
            title: "Correcto",
            text: 'Se actualizó el registro correctamente',
            icon: "success",
            confirmButtonText: "OK",
            timer: 5000,
          });

          // Cerramos modal
          this.dialogRef.close();
        } else {
          // Mensaje
          Swal.fire({
            title: "Error",
            text: "Ocurrio un error al crear el registro",
            icon: "error",
            confirmButtonText: "OK",
            timer: 5000,
          });
        }

      });
    }
  }

  openPanel() {
    this.opened = !this.opened;
  }
}
