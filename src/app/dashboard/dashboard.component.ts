import { AuthService } from '../services/auth.service';
import { ZonesService } from 'src/app/services/zones.service';
import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { CredentialModuleService } from '../services/credential-module.service';
import { NgxSpinnerService } from 'ngx-spinner';

class SProducto {
  nombre: string;
  total: number;
}

class SSucursal {
  _id: string;
  products: SProducto[]
}

class SDate {
  date: string;
  sucursales: SSucursal[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedSuc;
  selectedZone;
  isSuperAdmin: boolean;
  zonas;
  user;
  sucursales;
  sucursal;
  status;
  statusPM;
  today;
  loading: boolean = false;
  update = null;

  private authSvc = inject(AuthService)
  productColumns = ['nombre', 'total'];

  constructor(private breakpointObserver: BreakpointObserver,
              private zonesSvc: ZonesService,
              private credentialModuleSvc: CredentialModuleService,
              private spinner: NgxSpinnerService
            ) {
  }

  ngOnInit() {
    this.isSuperAdmin = false;
    // this.getZonas();
    this.getUser();

    this.today = moment().format('YYYY-MM-DD');
  }


  // getZonas() {
  getZonas(zones:string[]) {
    this.zonesSvc.getZonas().subscribe(zonas => {
      // this.zonas = zonas;
      if(this.user.role !== 'super administrativo') {
        this.zonas = (zonas as unknown[]).filter((z) => {
          if(zones.indexOf(z['_id']) !== -1) {
            return z;
          }  
        });
      } else {
        this.zonas = (zonas as unknown[]);
      }

      console.log('ZONAS', zonas)

      // this.getUser();

      // if(this.zonas.lenght != 0) {
      //   this.selectedZone = zonas[0];
      //   this.loadRemote(zonas[0]._id);
      // }
    });
  }

  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;

      console.log(this.user)

      this.credentialModuleSvc.validateUserCredential(this.user , 'dashboard.init.ver_dashboard'); //validar credencial

      if (this.user) {

        this.getZonas(user['zonas'] !== undefined ? user.zonas : [user.zona]);

        if (this.user.role === 'encargado de sucursal' ||
            this.user.role === 'cocinero') {
              // this.getSucursalVentas(this.user.sucursal);
              this.zonesSvc.getSucursal(this.user.sucursal).subscribe(sucursal => {
                this.sucursal = sucursal;
              });
        } else 
        if (this.user.role === 'supervisor' || this.user.role === 'gerente' || this.user.role === 'auxiliar de zona' || this.user.role === 'rh de zona' || this.user.role === 'administrativo') {
          this.selectedZone = user.zona;
          this.getSucursales(this.selectedZone._id);
          // this.zonas.map(z => {
          //   if (z._id === this.user.zona) {
          //     this.selectedZone = z;
          //     this.getSucursales(this.selectedZone._id);
          //   }
          // });
        } else {
          this.isSuperAdmin = true;
        }
      }
    });
  }


  getSucursales(id) {
    if(id !== undefined && id !== null) {
      this.zonesSvc.getSucursalesByZona(id).subscribe(sucursales => {
        this.sucursales = sucursales;
      });
    } else {
      this.sucursales = [];
    }
  }

  // loadRemote(zone_id: string, branch_id:string = 'all') {
  //   if(zone_id !== undefined && zone_id !== null) {
  //     this.getSucursales(zone_id);
  //   }
    
  //   // this.loading = true;
  //   this.spinner.show();
  //   this.disableUpdate();
  //   this.posSvc.getStatus(this.selectedZone._id, branch_id).subscribe(status => {
  //     this.status = status as SDate[];
  //     // this.loading = false;
  //     this.spinner.hide();
  //   });
  //   this.posSvc.getStatusPM(this.selectedZone._id, branch_id).subscribe(statusPM => {
  //     this.statusPM = statusPM as SDate[];
  //     // this.loading = false;
  //     this.spinner.hide();
  //   });
  // }

  // enableUpdate() {
  //   this.update = setInterval(() => {
  //     let suc_id = 'all';
  //     if(this.selectedSuc !== 'all' && this.selectedSuc !== undefined) {
  //       suc_id = this.selectedSuc._id;
  //     };

  //     this.posSvc.getStatus(this.selectedZone._id, suc_id).subscribe(status => {
  //       this.status = status as SDate[];
  //     });

  //   }, 1000 * 60);
  // }

  loadRemote(zone_id: string, branch_id: string = 'all') {
  if (zone_id) {
    this.getSucursales(zone_id);
  }

  this.spinner.show();
  this.disableUpdate();
  this.spinner.hide();

  // si necesitas limpiar valores:
  this.status = [];
  this.statusPM = [];
}

enableUpdate() {
  this.update = setInterval(() => {
    // si seleccionas sucursal, pero ya no usas POS, solo deja la lógica necesaria
    let suc_id = 'all';
    if (this.selectedSuc !== 'all' && this.selectedSuc !== undefined) {
      suc_id = this.selectedSuc._id;
    }

    // ya no consultas nada
  }, 1000 * 60);
}



  disableUpdate() {
    if(this.update !== null) {
      clearInterval(this.update);
    }
  }

}
