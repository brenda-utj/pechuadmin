import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Pechu-Admin';

  constructor(private authSvc: AuthService, private userSvc: UserService, private router: Router) { }

  ngOnInit(): void {
    /*
    this.authSvc.verifyLoggedIn().subscribe((loginData: any) => {

      // Verifica si existe una sesión en localStorage
      let identity = localStorage.getItem('identity');
      if(identity !== null){
        this.userSvc.findNumberIdentities(identity).subscribe((response: any) => {
          
          if(!response.sessionExpired && response.identities === 1){
            this.authSvc.setUser(loginData.user);
          } else if( response.sessionExpired || response.identities === 0 ) { //no tiene sesiones en bd
            Swal.fire({
              title: "Necesitas volver a iniciar sesión",
              text: "Para poder acceder al sistema",
              icon: "info",
              showCancelButton: false,
              confirmButtonText: "OK",
              confirmButtonColor: "#3f51b5", //Azul Pechugón
            }).then((result) => {
              if (result.isConfirmed) {
                this.userSvc.deleteOneIdentity(identity).subscribe((response: any) => {
                  localStorage.removeItem('token'); //remover sesión de almacenamiento
                  location.reload();
                });
              }
            });
          }
        });
      }else{
        // Elimina sesionde almacenamiento y recarga página
        localStorage.removeItem('token');
        location.reload();
      }
    });
    */
  }
  
  ngOnDestroy(){
  }

}
