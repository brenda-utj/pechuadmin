import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { ZonesService } from 'src/app/services/zones.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-traspasos',
  templateUrl: './traspasos.component.html',
  styleUrls: ['./traspasos.component.scss']
})
export class TraspasosComponent implements OnInit {
  user;
  requests;
  requesteds;
  isSuperAdmin: boolean;
  sucursal;
  sucursales: any[];
  zonas: any[];
  selectedZone: any;
  selectedSuc;
  traspasos = [];
  products;
  materias;
  displayedColumns = ['name', 'qty', 'accept', 'reject'];
  historialColumns = ['createdAt', 'product', 'desde', 'quantity', 'status'];
  searched: boolean;
  historial = [];
  allSucursals;
  historialDataSource: MatTableDataSource<any>;
  searchHistorial: string;

  constructor(private authSvc: AuthService, private productSvc: ProductsService,
              private zonesSvc: ZonesService, ) { }

  ngOnInit() {
    this.productSvc.getProducts().subscribe(products => {
      this.products = products;
      this.productSvc.getMaterias().subscribe(materias => {
        this.materias = materias;
        this.zonesSvc.getZonas().subscribe((zonas: any[]) => {
          this.zonas = zonas;
          this.zonesSvc.getAllSucursales().subscribe((sucursales: any[]) => {
            this.allSucursals = sucursales;
            this.isSuperAdmin = false;
            this.getUser();
          });
        });
      });
    });
  }

  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
      if (this.user) {
        if (this.user.role === 'cocinero' || this.user.role === 'encargado de sucursal') {
          this.getMyRequests(this.user.sucursal);
          this.selectedSuc = {_id: null };
          this.selectedSuc._id = this.user.sucursal;
          this.traerSolicitudes();
          this.traerHistorial();
        } else if (this.user.role === 'supervisor' || this.user.role === 'gerente' || this.user.role === 'auxiliar de zona' || this.user.role === 'rh de zona' || this.user.role === 'administrativo') {
          this.zonas.map(z => {
            if (z._id === this.user.zona) {
              this.selectedZone = z;
              this.getSucursales(this.selectedZone._id);
            }
          });
        } else {
          this.isSuperAdmin = true;
        }
      }

    });
  }

  getMyRequests(sucursal) {
    this.productSvc.traerMisSolicitudesTraspaso(sucursal).subscribe(requests => {
      this.requests = requests;
    });
  }

  getSucursales(zona) {
    this.zonesSvc.getSucursalesByZona(zona).subscribe((sucursales: any[]) => {
      this.sucursales = sucursales;
    });
  }

  traerSolicitudes() {
    this.productSvc.traerMisSolicitudesTraspaso(this.selectedSuc._id).subscribe((traspasos: any[]) => {
      this.searched = true;
      traspasos.forEach(t => {
        if (t.to !== null) {
          this.traspasos.push(t);
        }
      });
      this.traspasos.forEach(t => {
        this.products.forEach(p => {
          if (t.to.product === p._id) {
            t.product = p;
          }
        });
        this.materias.forEach(m => {
          if (t.to.materia === m._id) {
            t.product = m;
          }
        });
      });
    });
  }

  traerHistorial() {
    this.productSvc.traerHistorialTraspaso(this.selectedSuc._id).subscribe((historial: any[]) => {
      this.searched = true;
      this.historial = [];
      historial.forEach(t => {
        if (t.to.sucursal === this.selectedSuc._id) {
          this.historial.push(t);
        }
      });
      this.historial.forEach(t => {
        this.products.forEach(p => {
          if (t.to.product === p._id) {
            t.product = p;
          }
        });
        this.materias.forEach(m => {
          if (t.to.materia === m._id) {
            t.product = m;
          }
        });
        this.allSucursals.forEach(s => {
          if (t.from.sucursal === s._id) {
            t.desde = s;
          }
        });
      });
      this.historialDataSource = new MatTableDataSource(this.historial);
      this.historialDataSource.filterPredicate = (data, filter) => JSON.stringify(data).indexOf(filter) !== -1;
    });
  }

  applyFilter(filterValue: string) {
    this.historialDataSource.filter = filterValue.trim().toLowerCase();
  }

  acceptTraspaso(element) {
    this.productSvc.traspasar(element).subscribe(traspaso => {
      Swal.fire({
        title: "Correcto",
        text: "Aceptado exitosamente",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
        timer: 5000,
      });
      location.reload();
    });
  }

  rejectTraspaso(element) {
    this.productSvc.rechazarTraspaso(element._id).subscribe(rechazado => {
      Swal.fire({
        title: "Correcto",
        text: "Traspaso rechazado",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3f51b5",
        timer: 5000,
      });

      location.reload();
    });
  }
}
