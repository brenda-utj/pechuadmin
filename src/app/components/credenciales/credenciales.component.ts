import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CredencialesService } from '../../services/credenciales.service';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { AddCredencialesComponent } from './add-credenciales/add-credenciales.component';
import Swal from 'sweetalert2';

export interface CredentialInterface {
  _id: string;
  name: string;
  description: string;
  module: { name: string };
  submodule?: { name: string }; // submodule es opcional
}

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.scss']
})
export class CredencialesComponent implements OnInit {
  credentials;
  user;
  dataSource = new MatTableDataSource<CredentialInterface>();

  module: string = '';
  submodule: string = '';
  name: string = '';


  constructor(public dialog: MatDialog, private credencialesSvc: CredencialesService, private authSvc: AuthService) { }

  ngOnInit() {
    this.getCredentials();
    this.getUser();
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;      
    });
  }


  openDialogCreate(): void {
    const dialogRef = this.dialog.open(AddCredencialesComponent, {
      width: '98%',
      height: '15rem',
      maxHeight: '90vh',
      data: '',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCredentials();
    });
  }

  openDialogEdit(data: any): void {
    data["tipoModal"] = "edit";
    const dialogRef = this.dialog.open(AddCredencialesComponent, {
      width: '98%',
      height: '15rem',
      maxHeight: '90vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCredentials();  // Recargar las credenciales después de cerrar el diálogo
    });
  }

  deleteElement(data: any): void {
    let dataUser = {
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      zone: this.user.zona
    }

    Swal.fire({
      title: "¿Estás seguro que deseas eliminar la credencial?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      confirmButtonColor: "#3f51b5", //Azul Pechugón
    }).then((result) => {
      if (result.isConfirmed) {
        this.credencialesSvc.deleteCredential(dataUser, data._id).subscribe((res) => {
          this.getCredentials();
        });
      }
    });
  }

  getCredentials(){
    this.credencialesSvc.getCredentials().subscribe((res: CredentialInterface[]) => {
      // Ordenar el array res por res.module.name de A a Z
      res.sort((a, b) => a['module'].name.localeCompare(b['module'].name));
      this.credentials = res;
      this.dataSource.data = this.credentials;

      this.updateFilters(); // Llamar a updateFilters() después de cargar los datos
      
    });
  }

  updateFilters() {
    let ctrl = this;
    this.dataSource.data = this.credentials.filter(function (tipo) {
      let show = true;
  
      if (ctrl.module && ctrl.module.length !== 0) {
        if (tipo.module && tipo.module.name) {
          show = show && tipo.module.name.toLowerCase().includes(ctrl.module.toLowerCase());
        } else {
          show = false;
        }
      }
  
      if (ctrl.submodule && ctrl.submodule.length !== 0) {
        if (tipo.submodule && tipo.submodule.name) {
          show = show && tipo.submodule.name.toLowerCase().includes(ctrl.submodule.toLowerCase());
        } else {
          show = false;
        }
      }
  
      if (ctrl.name && ctrl.name.length !== 0) {
        if (tipo.name) {
          show = show && tipo.name.toLowerCase().includes(ctrl.name.toLowerCase());
        } else {
          show = false;
        }
      }
  
      return show;
    });
  }  
}
