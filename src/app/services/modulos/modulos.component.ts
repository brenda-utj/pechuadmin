import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSlideToggleChange, MatTableDataSource } from '@angular/material';
import { AddModuloComponent } from './add-modulo/add-modulo.component';
import { ModulosService } from 'src/app/services/modulos.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

export interface ModuleInterface {
  _id: string;
  name: string;
  displayName: string;
  icon: string;
  acciones: any;
  view: boolean;
}

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss']
})
export class ModulosComponent implements OnInit {
  modules: ModuleInterface[] = [];
  user;
  columnsToDisplay = ['name', 'displayName', 'icon', 'view', 'acciones'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  dataSource = new MatTableDataSource<ModuleInterface>();
  expandedElement: ModuleInterface | null = null;

  edit: boolean = false; // Bandera para determinar si el modal es de creación o edición
  name: string = '';
  displayName: string = '';

  constructor(
    public dialog: MatDialog,
    private moduloSvc: ModulosService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    this.getModulos();
    this.getUser();
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
    });
  }

  openDialogCreate() {
    const dialogRef = this.dialog.open(AddModuloComponent, {
      width: '98%',
      height: '90%',
      maxHeight: '90vh',
      data: '',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getModulos(); // Recargar los módulos después de cerrar el diálogo
    });
  }

  getModulos() {
    this.moduloSvc.getModules().subscribe((res: ModuleInterface[]) => {
      this.modules = res;
      this.dataSource.data = this.modules;
      this.updateFilters();
    });
  }

  openDialogEdit(data: any): void {
    data['tipoModal'] = 'edit';
    const dialogRef = this.dialog.open(AddModuloComponent, {
      width: '98%',
      height: '90%',
      maxHeight: '90vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getModulos(); // Recargar los módulos después de cerrar el diálogo
    });
  }

  deleteElement(data: any): void {
    let dataUser = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      zone: this.user.zona,
    };

    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el módulo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#3f51b5', // Azul Pechugón
    }).then((result) => {
      if (result.isConfirmed) {
        this.moduloSvc.deleteModule(dataUser, data._id).subscribe((res) => {
          Swal.fire({
            title: 'Correcto',
            text: 'Módulo eliminado',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3f51b5',
            timer: 5000,
          });

          this.getModulos();
        });
      }
    });
  }

  onToggleActive(element: ModuleInterface, event: MatSlideToggleChange) {
    const newActiveStatus = event.checked;

    // Preparar datos para actualizar
    const dataToUpdate = {
      view: newActiveStatus,
      userUpd: {
        name: this.user.name,
        lastname: this.user.lastname,
        username: this.user.username,
        zone: this.user.zona,
      },
    };

    // Llamar al servicio para actualizar el módulo
    this.moduloSvc.updateViewModule(dataToUpdate, element._id).subscribe(
      (res) => {
        // Actualización exitosa
        element.view = newActiveStatus;
      },
      (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado del módulo.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3f51b5',
        });
        // Revertir el cambio localmente
        element.view = !newActiveStatus;
      }
    );
  }

  updateFilters() {
    let ctrl = this;
    this.dataSource.data = this.modules.filter(function (tipo) {
      let show = true;

      if (ctrl.name && ctrl.name.length !== 0) {
        if (tipo.name != undefined && tipo.name != null) {
          show = show && tipo.name.toLowerCase().indexOf(ctrl.name.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if (ctrl.displayName && ctrl.displayName.length !== 0) {
        if (tipo.displayName != undefined && tipo.displayName != null) {
          show = show && tipo.displayName.toLowerCase().indexOf(ctrl.displayName.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      return show;
    });
  }
}
