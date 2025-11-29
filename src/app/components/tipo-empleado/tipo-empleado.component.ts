import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { TiposEmpleadosService } from "src/app/services/tipos-empleados.service";
import Swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { AddTipoEmpleadoComponent } from './add-tipo-empleado/add-tipo-empleado.component';
import { CredentialModuleService } from 'src/app/services/credential-module.service';

@Component({
  selector: 'app-tipo-empleado',
  templateUrl: './tipo-empleado.component.html',
  styleUrls: ['./tipo-empleado.component.scss']
})
export class TipoEmpleadoComponent implements OnInit {

  // @ViewChild("paginator", { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  filtroTexto = ""; 
  tipos;
  rows;
  buscar: boolean = true;
  user;

  paginator: MatPaginator;

  // Usamos un setter para asignar el paginador cuando esté disponible
  @ViewChild('paginator')
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  constructor(
    private tipoEmpSvc: TiposEmpleadosService,
    private authSvc: AuthService,
    private credentialModuleSvc: CredentialModuleService,
    public dialog: MatDialog
  ) {
   }

  ngOnInit(
  ) {
    this.getTipos();
    this.getUser();
  }
  getTipos() {
    this.tipoEmpSvc.getTipos().subscribe((tipos) => {
      if (tipos) {
        this.tipos = tipos;
        this.rows = this.tipos;
        this.dataSource = new MatTableDataSource(this.rows);
        this.dataSource.paginator = this.paginator;
  
        // Se aplica el filtro con el texto actual (si existe)
        if (this.filtroTexto && this.filtroTexto.trim().length) {
          this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
        }
      }
    });
  }
  
  openDialogEdit(data: any) {
    data["tipoModal"] = "edit";
    const dialogRef = this.dialog.open(AddTipoEmpleadoComponent, {
      width: "90%",
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTipos();
    });
  }
  openDialogCreate() {
    const dialogRef = this.dialog.open(AddTipoEmpleadoComponent, {
      width: "90%",
      data: "",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTipos();
    });
  }
  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'personal.init.ver_tipos_de_empleados'); //validar credencial
    });
  }
  aplicarFiltro() {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
  }

  changeBuscar() {
    if (this.buscar === true) {
      this.buscar = false;
    } else if (this.buscar === false) {
      this.buscar = true;
    }
  }

  deleteTipo(id: string) {
  Swal.fire({
    title: "¿Estás seguro que deseas eliminar este tipo?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
    confirmButtonColor: "#3f51b5", 
  }).then((result) => {
    if (result.isConfirmed) {
      this.tipoEmpSvc.deleteTipo(id, this.user._id).subscribe(() => {
        //Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Tipo eliminado con éxito',
          timer: 2000,
          showConfirmButton: false
        });
        //Recargar la tabla
        this.getTipos();
      });
    }
  });
}

}
