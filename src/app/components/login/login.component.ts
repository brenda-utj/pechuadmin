import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  });

  dataOriginal = {  //datos para hacer validaciones y búsquedas
    "user": null,
    "zona": null
  }

  constructor(private authSvc: AuthService,
              // public dialogRef: MatDialogRef<LoginComponent>, 
              private userSvc: UserService) {}

  ngOnInit() {
  }

  loginMethod() {
    forkJoin([
      this.findZoneByUsername(this.loginForm.value.username).pipe(
        catchError((error) => {
          Swal.fire({
            title: "Error",
            text: "El usuario no existe o está inactivo en sistema",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
          });
          return of(null); // Return a fallback value or handle the error appropriately
        })
      ),
      this.findIdByUsername(this.loginForm.value.username).pipe(
        catchError((error) => {
          Swal.fire({
            title: "Error",
            text: "El usuario no existe o está inactivo en sistema",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#3f51b5",
          });
          return of(null); // Return a fallback value or handle the error appropriately
        })
      )
    ]).subscribe(([zone, user]) => {
      if (zone === null || user === null) {
        return;
      }
      this.dataOriginal.zona = zone.toString();
      this.dataOriginal.user = user.toString();    
      this.isValidSession(this.dataOriginal.user).subscribe(async (valid: any) => {  
        this.authSvc.login(this.loginForm.value).subscribe(
          async (loginData: any) => {

            if(!valid.success){
              await Swal.fire({
                title: "Ya existen dos sesiones abiertas",
                text: "Este mensaje sólo es una alerta",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "OK",
                confirmButtonColor: "#3f51b5",
              });
            }
            if (loginData.user !== null) {
              this.authSvc.setUser(loginData.user);
              localStorage.setItem('token', loginData.token);
              this.authSvc.verifyLoggedIn().subscribe(async (verifyData: any) => {
                this.authSvc.setUser(verifyData.user);
                try {
                  if (verifyData.user !== null) {
                    let responseIdentity = await this.setIdentity(this.dataOriginal);
                    Swal.fire({
                      title: "Correcto",
                      text: "Se ha iniciado sesión correctamente",
                      icon: "success",
                      showCancelButton: false,
                      confirmButtonText: "OK",
                      confirmButtonColor: "#3f51b5",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // this.dialogRef.close();
                        location.reload();
                      }
                    });
                  } else {
                    alert('No se ha creado la sesión en la nube');
                  }
                } catch (error) {
                  alert('Ocurrió un error al crear la sesión en la nube');
                }
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "El usuario no tiene permitido el acceso a este sistema.",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#3f51b5",
              });
            }
          },
          async (error) => {
            await Swal.fire({
              text: "Contraseña incorrecta",
              icon: "warning",
              showCancelButton: false,
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5",
            });
          }
        );
      });
    });
  }

  findIdByUsername(username) {
    return this.userSvc.findUserByUsername(username);
  }

  findZoneByUsername(username) {
    return this.userSvc.findZoneByUsername(username);
  }

  async setIdentity(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userSvc.setIdentityAdm(data).subscribe(
        (response: any) => {
          const identity = response.identity; // Acceder al objeto identity
  
          const identityId = identity._id;
          localStorage.setItem("identity", identityId ? identityId : null); // Guardamos el id de sesión
  
          resolve(identity);
        },
        (error) => {
          console.log("Error al agregar usuario");
          console.log('setIdentity encountered an error:', error); // Log para depurar
          reject(null);
        }
      );
    });
  }

  isValidSession(user){
    return this.userSvc.validateIdentityAdm(user);
  }
}
