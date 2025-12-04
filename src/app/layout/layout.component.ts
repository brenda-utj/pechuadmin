import { TitleCasePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ModulosService } from '../services/modulos.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../components/login/login.component';

export interface Options {
  heading?: string;
  removeFooter?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [TitleCasePipe, AsyncPipe]
})
export class LayoutComponent implements OnInit, OnDestroy {
  modules: any = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public user;
  private _router: Subscription;
  routeOptions: Options;
  constructor(private breakpointObserver: BreakpointObserver,
              private moduleSvc: ModulosService,
              private authSvc: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private titleService: Title,
              public dialog: MatDialog,
              private userSvc: UserService) {}

  ngOnInit(): void {
    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        this.runOnRouteChange();
      });

      console.log('Get modules from layout')
    this.getModules();
    this.runOnRouteChange();
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  getModules() {
    this.moduleSvc.getModules().subscribe((req) => {
      this.modules = req;

      // Filtrar y ordenar los módulos activos
      this.modules = this.modules
        .filter(module => module.active)
        .sort((a, b) => a.position - b.position);

        
      // Procesar los módulos y submódulos para ajustarlos al formato requerido
      this.modules = this.modules.map(modulo => {
        // Establecer displayName usando el nombre o descripción
        modulo.displayName = modulo.displayName || modulo.name;

        // Procesar submódulos
        if (modulo.submodules && modulo.submodules.length > 0) {
          modulo.submodules = modulo.submodules.map(submodulo => {
            return {
              route: '/' + submodulo.file,
              icon: submodulo.icon,
              displayName: submodulo.displayName || submodulo.name,
              permission: submodulo.credential,
            };
          });
        } else {
          // Para módulos sin submódulos, establecer la ruta
          modulo.route = modulo.file ? '/' + modulo.file : '/' + modulo.name;
          modulo.submodules = [];
        }

        // Si necesitas manejar customClass u otras propiedades, puedes hacerlo aquí
        modulo.customClass = modulo.customClass || '';
        debugger
        return modulo;
      });
    });
  }

  runOnRouteChange(): void {
    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.routeOptions = activeRoute.snapshot.data;
    });

    if (this.routeOptions && this.routeOptions.hasOwnProperty('heading')) {
      this.setTitle(this.routeOptions.heading);
    }

    this.authSvc.user.subscribe((user) => {
      this.user = user;
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(
      'Pechu-Admin | ' + newTitle
    );
  }

  logout() {
    Swal.fire({
      title: "¿Estás seguro que deseas cerrar sesión?",
      text: "Puedes iniciar nuevamente con tu usuario y contraseña después",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      confirmButtonColor: "#3f51b5",
    }).then((result) => {
      if (result.isConfirmed) {
        const identity = localStorage.getItem('identity');
        // this.userSvc.closeIdentityAdm(identity).subscribe(
        //   response => {
        //     this.authSvc.setUser(null);
        //     localStorage.removeItem('token');
        //     this.router.navigate(['/']);
        //     location.reload();
        //   },
        //   error => {
        //     console.error('Error en la solicitud:', error);
        //   }
        // );
        this.authSvc.setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('identity');
            //this.router.navigate(['/']);
            //location.reload();
            sessionStorage.removeItem('user')
             this.router.navigate(['']);
                      this.dialog.open(LoginComponent, {
                        width: '550px',
                        disableClose: true
                      });
      }
    });
  }

  hasPermission(moduleName: string): boolean {
    return moduleName === 'eventos';
  }

  hasPermissionSubmodule(moduleName: string, permissionName: string): boolean {
    return true;
  }

}
