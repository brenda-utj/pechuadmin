import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { CredentialModuleService } from 'src/app/services/credential-module.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  user;
  users;
  zones;
  displayedColumns = ['name', 'username', 'role', 'sucursal', 'zone', 'actions'];

  resultado: any = this.findIdByUsername();
  
  rows = [];
  name = '';
  username = '';
  role = '';
  zona = '';
  sucursal = '';

  paginator: MatPaginator;
  // Usamos un setter para asignar el paginador cuando esté disponible
  @ViewChild('paginator')
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  constructor(public dialog: MatDialog, private userSvc: UserService, private credentialModuleSvc: CredentialModuleService, private authSvc: AuthService) { }

  ngOnInit() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'personal.init.ver_usuarios'); //validar credencial
      
      if(user !== null) {
        this.zones = user['zonas'] !== undefined ? user.zonas : [user.zona];
        this.getUsers();
      }
    });
    
  }

  getUsers() {
    this.userSvc.getUsers().subscribe(users => {
      // this.users = users;
      if(this.user.role !== 'super administrativo') {
        if(this.zones) {
          this.users = (users as unknown[]).filter((z) => {
            // console.log("z['zona']", z['zona']);
            if(z['zona'] !== null && this.zones.indexOf(z['zona']._id) !== -1) {
              return z;
            }  
          });
        }
      } else {
        this.users = (users as unknown[]);
      }

      this.rows = this.users;

      this.dataSource = new MatTableDataSource(this.rows);
      this.dataSource.paginator = this.paginator;

      this.updateFilters();
    });
  }

  //identity admin
  findIdByUsername(){
    this.userSvc.findUserByUsername("desarrollo_jr").subscribe(
      (user) => {
        //const id = user
        this.resultado = user; // Asignar la respuesta al resultado
      },
      (error) => {
        console.log("Error al obtener el usuario:", error);
        this.resultado = null; // O mostrar un mensaje de error en el HTML
      }
    );
  }

  validateIdentityAdm(){

  }

  setIdentityAdm(){
    //this.userSvc.setIdentityAdm().subscribe()
  }

  closeIdentityAdm(){

  }

  deleteIdentityAdm(){

  }

  openDialog(type) {
    const dialogRef = this.dialog.open(AddUserComponent , {
      width: '90%',
      data: type
    });

    dialogRef.afterClosed().subscribe(closed => {
      this.getUsers();
    });
  }

  removeUser(id) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar este usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      confirmButtonColor: "#3f51b5", //Azul Pechugón
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSvc.deleteUser(id, this.user._id).subscribe(deleted => {
          this.getUsers();

          Swal.fire({
            title: "Correcto",
            text: `Usuario eliminado`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
        });
      }
    });
  }

  checkRoles(element): boolean {
    if (this.user.role === 'super administrativo') {
      return true;
    } else if (this.user.role === 'administrativo') {
      if (element.role === 'auxiliar de zona' || element.role === 'gerente' ||
          element.role === 'encargado de sucursal' || element.role === 'cocinero' || element.role === 'supervisor' || element.role === 'rh de zona') {
            return true;
          }
    } else if (this.user.role === 'rh de zona'){
      if (element.role === 'auxiliar de zona' || element.role === 'gerente' ||
          element.role === 'encargado de sucursal' || element.role === 'cocinero') {
            return true;
          }
    } else if (this.user.role === 'auxiliar de zona') {
      if (element.role === 'encargado de sucursal' || element.role === 'cocinero' || element.role === 'gerente') {
        return true;
      }
    } else if (this.user.role === 'gerente') {
      if (element.role === 'encargado de sucursal' || element.role === 'cocinero') {
        return true;
      } else if (this.user.role === 'encargado de sucursal') {
        if (element.role === 'cocinero') {
        return true;
        }
      } else {
        return false;
      }
    } else if(this.user.role === 'supervisor'){
      if (element.role === 'encargado de sucursal' || element.role === 'cocinero') {
        return true;
      } else if (this.user.role === 'encargado de sucursal') {
        if (element.role === 'cocinero') {
        return true;
        }
      } else {
        return false;
      }
    }
  }

  updateFilters() {
    let ctrl = this;
    this.dataSource.data = this.users.filter(function(user) {

    // this.rows = this.users.filter(function(user) {
      
      let show = true;
      

      if( ctrl.name.length !== 0 ) {
        if(user.name !== undefined && user.name !== null) {
          show = show && `${user.name} ${user.lastname}`.toLowerCase().indexOf(ctrl.name.toLowerCase()) !== -1;
          console.log(ctrl.name, `${user.name} ${user.lastname}`, show);
        } else {
          show = false;
        }
      }


      if( ctrl.username.length !== 0 ) {
        if(user.username !== undefined && user.username !== null) {
          show = show && user.username.toLowerCase().indexOf(ctrl.username.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if( ctrl.role.length !== 0 ) {
        if(user.role !== undefined && user.role !== null) {
          show = show && user.role.toLowerCase().indexOf(ctrl.role.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if( ctrl.sucursal.length !== 0 ) {
        if(user.sucursal !== null && user.sucursal.name !== undefined && user.sucursal.name !== null) {
          show = show && user.sucursal.name.toLowerCase().indexOf(ctrl.sucursal.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if( ctrl.zona.length !== 0 ) {
        if(user.zona !== null && user.zona.name !== undefined && user.zona.name !== null) {
          show = show && user.zona.name.toLowerCase().indexOf(ctrl.zona.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      return show;

    });
  }
}
