import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoService } from 'src/app/services/tipo.service';
import { SubtipoService } from 'src/app/services/subtipo.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AddTipoComponent } from './add-tipo/add-tipo.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CredentialModuleService } from 'src/app/services/credential-module.service';

@Component({
  selector: 'app-tipo-subtipo',
  templateUrl: './tipo-subtipo.component.html',
  styleUrls: ['./tipo-subtipo.component.scss']
})

export class TipoSubtipoComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  user;
  users;
  tipos;
  rows;
  displayedColumns: string[] = ['nombre', 'descripcion', 'actions'];
  nombre: string = '';
  descripcion: string = '';

  paginator: MatPaginator;
  // Usamos un setter para asignar el paginador cuando esté disponible
  @ViewChild('paginator')
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  constructor(public dialog: MatDialog, private tipoService: TipoService, private subtipoService: SubtipoService, private credentialModuleSvc: CredentialModuleService, private authSvc: AuthService) { }
  ngOnInit() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'gastos.init.ver_tipos_subtipos'); //validar credencial

    });
    this.getTipo();
  }
  modifyTipo(itemId, field, userId) {
    try {
      this.tipoService.modifyTipoField(itemId, field, userId).subscribe(updated => {
      });
    } catch (error) {
      console.error('Error al asignar el id del usuario a la acción', error);
    }
  }
  getTipo() {
    this.tipoService.getTipo().subscribe((data: any[]) => {
      this.tipos = data;
      this.rows = this.tipos;
      this.dataSource = new MatTableDataSource(this.rows);
      this.dataSource.paginator = this.paginator;
      this.updateFilters();
    });
  }
  removeTipo(id) {
    Swal.fire({
      title: '¿Seguro que deseas borrar este tipo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoService.deleteTipo(id).subscribe(response => {
          this.modifyTipo(id,"userDel", this.user._id);
          if (response) {
            Swal.fire({
              title: 'Borrado',
              confirmButtonColor: '#3085d6',
              text: 'El tipo ha sido eliminado exitosamente',
              icon: 'success'
            });
            this.getTipo();
          } else {
            Swal.fire({
              title: 'Error',
              confirmButtonColor: '#3085d6',
              text: 'El tipo no pudo ser eliminado',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  openAddTipoDialog(type) {
    const dialogRef = this.dialog.open(AddTipoComponent, {
      width: '90%',
      disableClose: true,
      data: type
    });
    dialogRef.afterClosed().subscribe(closed => {
      this.getTipo();
    });
  }
  //Eliminar filtros manuales
  handlePageEvent(event: PageEvent): void {
    this.dataSource = new MatTableDataSource(this.rows);
    this.dataSource.paginator = this.paginator;

    this.nombre = '';
    this.descripcion = '';
  }
  updateFilters() {

    let ctrl = this;
    this.dataSource = this.tipos.filter(function (tipo) {
      let show = true;
      if (ctrl.nombre.length !== 0) {

        if (tipo.nombre !== undefined && tipo.nombre !== null) {
          show = show && `${tipo.nombre}`.toLowerCase().indexOf(ctrl.nombre.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }
      if (ctrl.descripcion.length !== 0) {
        if (tipo.descripcion !== undefined && tipo.descripcion !== null) {
          show = show && tipo.descripcion.toLowerCase().indexOf(ctrl.descripcion.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }
      return show;

    });

  }

}