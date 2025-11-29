import { Component, OnInit } from '@angular/core';
import { ZonesService } from 'src/app/services/zones.service';
import { MatDialog } from '@angular/material/dialog';
import { InventoryComponent } from '../inventory/inventory.component';
import { AddsucursalComponent } from './addsucursal/addsucursal.component';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';
import { CredentialModuleService } from 'src/app/services/credential-module.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {
  zona;
  zonas;
  sucursales;
  sucursals;
  user;
  inventarios;
  displayedColumns = ['cantidad', 'name', 'type', 'qty', 'from', 'action'];
  fromObj;
  editName: boolean;
  isSuperAdmin: boolean;
  constructor(private sucursalSvc: ZonesService, private dialog: MatDialog,
              private authSvc: AuthService,
              private credentialModuleSvc: CredentialModuleService,
              private productSvc: ProductsService
              ) { }

  ngOnInit() {
    this.isSuperAdmin = false;
    this.authSvc.user.subscribe(user => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'zonas_y_sucursales.init.ver_sucursales'); //validar credencial

      if (this.user) {

        this.getZonas(user['zonas'] !== undefined ? user.zonas : [user.zona]);

        this.getAllSucursals();
        if (!this.isManager()) {
          // this.productSvc.getInventariosBySuc(this.user.sucursal).subscribe(inventarios => {
          //   this.inventarios = inventarios;
          // });
          this.dialog.open(InventoryComponent, {
            width: '800px',
            data: this.user.sucursal
          });        } else {
          if (this.user.role !== 'super administrativo') {
            this.zona = this.user.zona;
            this.getSucursales(null);
          } else {
            this.isSuperAdmin = true;
          }
        }
      }
     });
    this.zonas
  }

  getAllSucursals() {
      this.sucursalSvc.getSucursalesByZona(this.user.zona).subscribe(sucursals => {
        this.sucursals = sucursals;
      });
  }

  getSucursales(evt) {
    this.sucursalSvc.getSucursalesByZona(this.zona).subscribe(sucursales => {
      this.sucursales = sucursales;
    });
  }

  isManager(): boolean {
    if (this.user) {
      if (this.user.role === 'super administrativo' || this.user.role === 'administrativo' || this.user.role === 'rh de zona' || this.user.role === 'supervisor' ||
      this.user.role === 'gerente' || this.user.role === 'auxiliar de zona') {
        return true;
      } else {
        return false;
      }
    }
  }

// getZonas() {
  getZonas(zones:string[]) {
    this.sucursalSvc.getZonas().subscribe(zonas => {
      // this.zonas = zonas;

      if (this.user.role !== 'super administrativo') {
        this.zonas = (zonas as unknown[]).filter((z) => {
          if(zones.indexOf(z['_id']) !== -1) {
            return z;
          }  
        });
      } else {
        this.zonas = (zonas as unknown[])
      }

      // this.getUser();

      // if(this.zonas.lenght != 0) {
      //   this.selectedZone = zonas[0];
      //   this.loadRemote(zonas[0]._id);
      // }
    });
  }

  // getZonas() {
  //   this.sucursalSvc.getZonas().subscribe(zonas => {
  //     this.zonas = zonas;
  //   });
  // }

  openInventory(s) {
    this.dialog.open(InventoryComponent, {
      width: '90%',
      data: s._id
    });
  }

  edit(s) {
    const dialogRef = this.dialog.open(AddsucursalComponent, {
      width: '90%',
      data: s
    });

    dialogRef.afterClosed().subscribe(closed => {
      this.zonas
    });  }

  openDialog() {
    const dialogRef = this.dialog.open(AddsucursalComponent, {
      width: '90%',
      data: null
    });

    dialogRef.afterClosed().subscribe(closed => {
      this.zonas
    });
  }


  solicitarTraspaso(element) {
    if (element.trespassingQty !== 0 || element.trespassingQty !== undefined || element.trespassingQty !== null) {
      const data = {
        to: element._id,
        quantity: element.trespassingQty,
        requestor: this.user._id,
        from: this.fromObj._id,
        name: element.materia ? element.materia.name : element.product.name
      };
      this.productSvc.crearTraspaso(data).subscribe(traspaso => {
        Swal.fire({
          title: "Correcto",
          text: "Solicitud procesada!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3f51b5",
          timer: 5000,
        });
        if (!this.isManager()) {
          this.productSvc.getInventariosBySuc(this.user.sucursal).subscribe(inventarios => {
            this.inventarios = inventarios;
          });
        }
        this.zonas
      });
    }
  }

  getInventory(sucursal, product) {
    this.productSvc.getInventoryByProductAndSuc(product.product._id, sucursal._id).subscribe(inventory => {
      this.fromObj = inventory;
    });
  }
}
