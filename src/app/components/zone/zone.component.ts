import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CredentialModuleService } from 'src/app/services/credential-module.service';
import { ZonesService } from 'src/app/services/zones.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
  zonas;
  user;
  name: string;
  rows = [];
  filter_name = '';
  constructor(private zonaSvc: ZonesService, private authSvc: AuthService, private credentialModuleSvc: CredentialModuleService,) { }

  ngOnInit() {
    this.getZonas();
    this.getUser();
  }

  getUser(){
    this.authSvc.user.subscribe(user => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'zonas_y_sucursales.init.ver_zonas'); //validar credencial
    });
  }

  crearZona() {
    const data = {
      name: this.name
    };
    this.zonaSvc.crearZona(data).subscribe(created => {
      this.getZonas();
      this.name = '';
    });
  }

  getZonas() {
    this.zonaSvc.getZonas().subscribe((zonas: any[]) => {
      zonas.map(zona => {
        return zona.isEdit = false;
      });
      this.zonas = zonas;
      this.rows = zonas;
    });
  }

  editName(z) {
    z.isEdit = true;
  }

  submitChange(z) {
    this.zonaSvc.updateZona(z).subscribe(updated => {
      z.isEdit = false;
    });
  }

  updateFilters() {
    let ctrl = this;
    this.rows = this.zonas.filter(function(zona) {
      
      let show = true;
      

      if( ctrl.filter_name.length !== 0 ) {
        if(zona.name !== undefined && zona.name !== null) {
          show = show && zona.name.toLowerCase().indexOf(ctrl.filter_name.toLowerCase()) !== -1;
          console.log(ctrl.filter_name, zona.name, show);
        } else {
          show = false;
        }
      }

      return show;

    });
  }
}
