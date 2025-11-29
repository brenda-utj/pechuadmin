import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ZonesService } from 'src/app/services/zones.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userForm = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    lastname: new UntypedFormControl(''),
    email: new UntypedFormControl('', [ Validators.email]),
    password: new UntypedFormControl(''),
    sucursal: new UntypedFormControl(''),
    zona: new UntypedFormControl(''),
    zonas: new UntypedFormControl(''),
    role: new UntypedFormControl(''),
    authkey: new UntypedFormControl('')
  });
  zonas;
  password: string;
  sucursales;
  roles;
  user;
  opened: boolean;
  disableZona: boolean;
  @ViewChild('username', {static: true}) usernameInput: ElementRef;
  editPassword: boolean;
  isEditMode: boolean = false;

  // roles = ['cocinero', 'encargado de sucursal', 'gerente', 'auxiliar de zona', 'administrativo', 'super administrativo'];
  constructor(private zonesSvc: ZonesService, private dialogRef: MatDialogRef<AddUserComponent>,
              private userSvc: UserService, @Inject(MAT_DIALOG_DATA) public data,
              private authSvc: AuthService) { }

  ngOnInit() {
    // this.getZonas();
    this.getUser();
    this.isEditMode = this.data !== null;
    
    if (this.isEditMode) {
      this.userForm.patchValue({
        username: this.data.username,
        name: this.data.name,
        lastname: this.data.lastname,
        role: this.data.role,
        email: this.data.email,
        sucursal: this.data.sucursal ? this.data.sucursal._id : this.data.sucursal,
        zona: this.data.zona ? this.data.zona._id : this.data.zona,
        zonas: this.data['zonas'] !== undefined ? this.data.zonas : [],
        authkey: this.data.authkey
      });
    }
  }

  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
      //console.log(this.user)
      if (this.user) {
        //this.getZonas();

        this.getZonas(user['zonas'] !== undefined ? user.zonas : [user.zona]);      

        switch (this.user.role) {
          case 'super administrativo':
            this.editPassword = true;
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal', 'supervisor', 'gerente', 'auxiliar de zona', 'rh de zona','administrativo', 'super administrativo'];
            
            break;
          case 'administrativo':
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal', 'supervisor', 'gerente', 'auxiliar de zona', 'rh de zona'];
            this.disableZona = true;
            // this.userForm.patchValue({
            //   zona: this.data.zona
            // });
            //this.userForm.controls.zona.disable();
            
            break;
          case 'rh de zona':
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal', 'supervisor', 'gerente', 'auxiliar de zona', 'rh de zona'];
            this.disableZona = true;
            // this.userForm.patchValue({
            //   zona: this.data.zona
            // });
            //this.userForm.controls.zona.disable();
            
              break;
          case 'auxiliar de zona':
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal', 'gerente'];
            this.disableZona = true;
            // this.userForm.patchValue({
            //   zona: this.data.zona
            // });
            
            break;
          case 'gerente':
            this.disableZona = true;
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal'];
            // this.userForm.patchValue({
            //   zona: this.data.zona
            // });
            
            break;
          case 'supervisor':
            this.disableZona = true;
            this.roles = [
              // 'cocinero', 
              'encargado de sucursal'];
            // this.userForm.patchValue({
            //   zona: this.data.zona
            // });
            
            break;
          case 'encargado de sucursal':
            this.disableZona = true;
            // this.roles = ['cocinero'];
            this.roles = [];

              // break;
        }

      }
    });
  }

  addUser() {
    let error = false;
    let data = this.userForm.value;

    for (let key in data) {
      if (typeof data[key] === 'string') {
        // Verificar si el campo está vacío o nulo y eliminarlo del objeto
        if (data[key] === '' || data[key] === null) {
          delete data[key];
          continue; // Pasar al siguiente campo después de eliminar el campo vacío o nulo
        }

        // Eliminar espacios en blanco
        data[key] = data[key].trim();
          
        // Si el campo está vacío después de recortar los espacios, establecer error en true y salir del ciclo
        if (data[key] === '') {
          error = true;
          break;
        }
      }
    }

    if(error){
      Swal.fire({
        title: "Error",
        text: "Los campos marcados con (*) son obligatorios",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
      });

      return;
    } else {
      if(data.zonas === null || data.zonas.length === 0  && data.zona === null) {
        data.zonas = [data.zona];
      }
  
      for (let key in data) {
        if (data[key] === '') {
          delete data[key]; 
        }
      }
      
      if (this.data !== null) {
        data._id = this.data._id;
        this.userSvc.updateUser(data, this.user._id).subscribe(updated => {
          Swal.fire({
            title: "Correcto",
            text: "Usuario actualizado",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
          this.close();
        });
      } else {
        this.userSvc.createUser(data, this.user._id).subscribe(created => {
          Swal.fire({
            title: "Correcto",
            text: "Usuario creado",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
            timer: 5000,
          });
          this.close();
        }, err => {
          if (err.error === 'user validation failed: username: username already exists') {
            Swal.fire({
              title: "Error",
              text: "El nombre de usuario ya se encuentra en uso",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5",
            });
  
            // alert('El nombre de usuario ya se encuentra en uso');
            this.userForm.reset();
            this.usernameInput.nativeElement.focus();
          }
        });
      }
    } 
  }

  // getZonas() {
    getZonas(zones:string[]) {
      this.zonesSvc.getZonas().subscribe(zonas => {
        // this.zonas = zonas;
        //console.log(zones)
        if(this.user.role !== 'super administrativo' ) {
          // console.log((zonas as unknown[]));
          this.zonas = (zonas as unknown[]).filter((z) => {
            if(zones.indexOf(z['_id']) !== -1) {
              return z;
            }  
          });
        } 
        else {
          this.zonas = (zonas as unknown[]);
        }

        
        if(this.user.role !== 'super administrativo') {
          this.zonas.map(z => {
            if (z._id === this.userForm.value.zona) {
              //this.userForm.controls.zona.setValue(z._id);
              this.getSucursales(z._id);
            }
          });
        } else {
          //console.log('this.userForm.value.sucursal', this.userForm.value.sucursal);
          if(this.data !== null) {
            this.getSucursales(this.userForm.value.zona);
          }
        }  
      });
    }

  getSucursales(id) {
    this.zonesSvc.getSucursalesByZona(id).subscribe((sucursales: any[]) => {
      this.sucursales = sucursales;
    });
  }

  close() {
    this.dialogRef.close();
  }

  openPanel() {
    this.opened = !this.opened;
  }

  changePassword() {
    const data = {
      _id: this.data._id,
      password: this.password
    };
    this.userSvc.changePassword(data).subscribe(changed => {
      Swal.fire({
        title: "Correcto",
        text: "Contraseña cambiada con éxito",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
        timer: 5000,
      });
    });
  }
}
