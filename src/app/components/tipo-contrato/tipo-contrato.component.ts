import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TiposContratoService } from 'src/app/services/tipos-contrato.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { AddTipoContratoComponent } from './add-tipo-contrato/add-tipo-contrato.component';
import { CredentialModuleService } from 'src/app/services/credential-module.service';



@Component({
  selector: 'app-tipo-contrato',
  templateUrl: './tipo-contrato.component.html',
  styleUrls: ['./tipo-contrato.component.scss']
})
export class TipoContratoComponent implements OnInit {

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
    private tipoContratoSvc: TiposContratoService,
    private authSvc: AuthService,
    private credentialModuleSvc: CredentialModuleService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getTiposContrato();
    this.getUser();
  }

  getTiposContrato() {
    this.tipoContratoSvc.getTipos().subscribe((tipos) => {
      if (tipos) {
        this.tipos = tipos;
        this. rows = this.tipos;
        this.dataSource = new MatTableDataSource(this.rows);
        this.dataSource.paginator = this.paginator;

        //Se aplica el filtro de nuevo con el texto actual
        if (this.filtroTexto && this.filtroTexto.trim().length) {
          this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
        }
      }
    });
  }

  openDialogEdit(data: any) {
    data["tipoModal"] = "edit";
    const dialogRef = this.dialog.open(AddTipoContratoComponent, {
      width: "90%",
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTiposContrato();
    });
  }

  openDialogCreate() {
    const dialogRef = this.dialog.open(AddTipoContratoComponent, {
      width: "90%",
      data: "",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTiposContrato();
    });
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'personal.init.ver_tipos_de_contratos'); //validar credencial
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

  delete(id){
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
        this.tipoContratoSvc
          .deleteTipo(id, this.user._id)
          .subscribe((response) => {
            this.getTiposContrato();
          });
      }
    });
  }


}
