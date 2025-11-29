import { PosService } from '../../services/pos.service';
import { AuthService } from '../../services/auth.service';
import { ZonesService } from '../../services/zones.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import {MatDialog} from '@angular/material/dialog';
import { SaleComponent } from '../sale/sale.component';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { ProductsService } from 'src/app/services/products.service';
import { CredentialModuleService } from 'src/app/services/credential-module.service';
import { NgxSpinnerService } from 'ngx-spinner';

class SDTipo {
  tipo: number;
  subtipo: string;
  total: number;
}

class SDProducto {
  _id: string;
  movimientos: SDTipo[]
}

class PMSummary {
  decs: PMSummaryGroup[];
  incs: PMSummaryGroup[];
}

class PMSummaryGroup {
  tipo: number;
  subtipo: string;
  total: number;
}

export enum MBMovementMethod {
  CASH = 'cash',
  CARD = 'ccdc'
}

@Component({
  selector: 'app-inventory-movements',
  templateUrl: './inventory-movements.component.html',
  styleUrls: ['./inventory-movements.component.scss']
})
export class InventoryMovementsComponent implements OnInit {
  zonas;
  sucursales;
  productos;
  usuarios;
  user;
  selectedSuc;
  selectedZone;
  selectedPos;
  selectedProduct;
  sucursal;
  date;
  date_to;
  isSuperAdmin: boolean;
  poss;
  searched: boolean = false;
  searched2: boolean = false;
  salesDataSource= [];
  courtesyDataSource= [];
  tableColumns = ['cant', 'nombre', 'tipo_item', 'tipo', 'decoded_tipo', 'comentario','venta', 'fecha', 'desucursal', 'asucursal'];
  
  summaryDataSource = [];
  moneybox = [];
  tickets = [];
  loading:boolean = false;
  pos;
  rows = [];
  sale = null;

  ticket = '';
  tipo_item = '-';
  tipo = '-';
  subtipo = '';
  comentario = '';
  origin = '';
  dest = '';
  nombre = '';

  status = [];
  productSummary:PMSummary = null;
  materiaSummary:PMSummary = null;
  productColumns = ['total', 'tipo'];
  
  constructor(private zonesSvc: ZonesService,
              private productSvc: ProductsService,
              private authSvc: AuthService,
              private posSvc: PosService,
              private excelSvc: ExcelService,
              private credentialModuleSvc: CredentialModuleService,
              public dialog: MatDialog,
              private spinner: NgxSpinnerService) {
                this.usuarios = [];
              }

  ngOnInit() {
    this.isSuperAdmin = false;
    this.getUser();
    this.getProductos();
    if(this.user.role === 'super administrativo'){
      this.tableColumns.push('_id')
    }
    this.poss = [];
  }

  getTotal() {
    return this.rows.map(t => {
      // return t.total;
      return t.isCanceled ? 0 : t.total;
    }).reduce((acc, value) => acc + value, 0);
  }

  getCourtesiesTotal() {
    return this.pos.courtesies.map(t => {
      // return t.total;
      return t.isCanceled ? 0 : t.total;
    }).reduce((acc, value) => acc + value, 0);
  }

  getUser() {
    this.authSvc.user.subscribe(user => {
      this.user = user;
      this.credentialModuleSvc.validateUserCredential(this.user , 'registros_y_movimientos.init.ver_movimientos_inventario'); //validar credencial
      if (this.user) {

        this.getZonas(user['zonas'] !== undefined ? user.zonas : [user.zona]);        this.getZonas(user['zonas'] !== undefined ? user.zonas : [user.zona]);

        if (this.user.role === 'encargado de sucursal' ||
            this.user.role === 'cocinero') {
              // this.getSucursalVentas(this.user.sucursal);
              this.zonesSvc.getSucursal(this.user.sucursal).subscribe(sucursal => {
                this.selectedSuc = sucursal;
              });
        } else 
        if (this.user.role === 'supervisor' || this.user.role === 'gerente' || this.user.role === 'auxiliar de zona' || this.user.role === 'rh de zona' || this.user.role === 'administrativo') {

          this.selectedZone = this.user.zona;
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

  getProductos(){
    this.productSvc.getProducts().subscribe(productos => {
      this.productos = productos as any[];
      this.productSvc.getMaterias().subscribe(materias => {
        this.productos = this.productos.concat( materias as any [] );
        this.productos.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        this.productos.sort((a,b) => (b.name.includes('ollo') - a.name.includes('ollo') ))
        //console.log(this.productos)
      })
    })
  }

  getZonas(zones:string[]) {
      this.zonesSvc.getZonas().subscribe(zonas => {

        if(this.user.role !== 'super administrativo') {
          // this.zonas = zonas;
          this.zonas = (zonas as unknown[]).filter((z) => {
            if(zones.indexOf(z['_id']) !== -1) {
              return z;
            }  
          });
        } else {
          this.zonas = (zonas as unknown[]);
        }
        // this.getUser();
  
        // if(this.zonas.lenght != 0) {
        //   this.selectedZone = zonas[0];
        //   this.loadRemote(zonas[0]._id);
        // }
      });
  }

  getSucursales(id) {
    if(id !== undefined && id !== null) {
      this.zonesSvc.getSucursalesByZona(id).subscribe(sucursales => {
        this.sucursales = sucursales as any[];
        if(this.sucursales.length !== 0) {
          this.selectedSuc = this.sucursales[0]._id;
        }
      });
    } else {
      this.sucursales = [];
    }
  }

  getSesiones() {
    if(this.date && this.selectedSuc) {
      this.poss = [];
      this.posSvc.getList(this.selectedSuc._id, moment(this.date).format('YYYY-MM-DD')).subscribe(data => {
        let list = data as any[];
        for(let i = 0; i < list.length; i++) {
          let ii = this.poss.findIndex(pos => pos.id === list[i].id);
          if(ii === -1) {
            this.poss.push(list[i]);
          }
        }
        
        if(this.poss.length !== 0) {
          this.selectedPos = this.poss[0];
          this.buscar();
        }

      });
    }
  }

  buscar() {
    // this.loading = true;
    this.spinner.show();

    let datefrom:string = moment(this.date).tz("America/Mexico_City").format('YYYY-MM-DD');
    let dateto:string = moment(this.date_to).tz("America/Mexico_City").format('YYYY-MM-DD');

    this.posSvc.getProductInventoryMovementsSummaryByRange(this.selectedZone._id,this.selectedSuc, datefrom, dateto, '5e162982b523a93887b00883').subscribe(summary => {
      this.productSummary = summary as PMSummary;
      this.searched = true;
      // this.loading = false;
      this.spinner.hide();
    });

    this.posSvc.getMateriaInventoryMovementsSummaryByRange(this.selectedZone._id,this.selectedSuc, datefrom, dateto, '5e162517b523a93887b00863').subscribe(summary => {
      this.materiaSummary = summary as PMSummary;
      this.searched = true;
      // this.loading = false;
      this.spinner.hide();
    });
  }

  buscarDetalles() {
    // this.loading = true;
    this.spinner.show();
    this.resetFilters();

    let datefrom:string = moment(this.date).tz("America/Mexico_City").format('YYYY-MM-DD');
    let dateto:string = moment(this.date_to).tz("America/Mexico_City").format('YYYY-MM-DD');

    this.rows = [];

    this.posSvc.getInventoryMovementsByRange(this.selectedZone._id, this.selectedSuc, this.selectedProduct, datefrom, dateto).subscribe(pos => {
      this.searched = true;
      this.searched2 = true;
      this.pos = pos;
      this.rows = this.pos.sales;
      this.rows.sort((a,b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0));
      // this.loading = false;
      this.spinner.hide();
      
    });
  }

  export() {
    let imt = document.getElementById("inventory-movements-table");
    
    let worksheet_imt = XLSX.utils.table_to_sheet(imt);
    

    let a = XLSX.utils.sheet_to_json(worksheet_imt, { header: 1 });
    

    let excel:any[] = [['Movimientos de inventario', '']];
    excel = excel.concat(a);

    this.excelSvc.exportExcel(excel, `reporte`);
  }
  
  updateFilters() {
    let ctrl = this;
    this.rows = this.pos.sales.filter(function(mov) {
      
      let show = true;
      
      // if(ctrl.status != '-') {
      //   show = show && ( parseInt(ctrl.status) == 1 ?  mov.isCanceled == false : mov.isCanceled == true );
      // }

      if( ctrl.tipo_item !== '-' ) {

        if(parseInt(ctrl.tipo_item) === 0 && mov.materia !== undefined && mov.materia !== null) {
          show = true;
        } else if(parseInt(ctrl.tipo_item) === 1 && mov.producto !== undefined && mov.producto !== null) {
          show = true;
        } else {
          show = false;
        }
        
      }

      if( ctrl.nombre.length !== 0 ) {
        if(mov.producto !== undefined && mov.producto !== null) {
          show = show && mov.producto.name.toLowerCase().indexOf(ctrl.nombre.toLowerCase()) !== -1;
        } else if(mov.materia !== undefined && mov.materia !== null) {
          show = show && mov.materia.name.toLowerCase().indexOf(ctrl.nombre.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if(ctrl.tipo !== '-') {
        show = show && ( parseInt(ctrl.tipo) === mov.tipo );
      }


      if( ctrl.subtipo.length !== 0 ) {
        /*
        if(mov['comments'] != undefined) {
          //show = show && mov.comments.toLowerCase().substring(0, ctrl.subtipo.length) == ctrl.subtipo.toLowerCase();
          show = show && mov.comments.toLowerCase().indexOf(ctrl.subtipo.toLowerCase()) != -1;
        } else {
          */
          if(mov.subtipo !== undefined && mov.subtipo !== null) {
          
            let decoded_tipo = '';
            if(mov.tipo === 0) {
              if(mov.subtipo === 'COCINA') {
                decoded_tipo = 'POLLO PARA TACO';
              } else if(mov.subtipo === 'PROD') {
                decoded_tipo = 'PRODUCCIÓN';
              } else if(mov.subtipo === 'TRA') {
                decoded_tipo = 'TRASPASO';
              }
            } else if(mov.tipo === 1) {
              if(mov.subtipo === 'COCINA') {
                decoded_tipo = 'COCINA';
              } else if(mov.subtipo === 'PROD') {
                decoded_tipo = 'PRODUCCIÓN';
              } else if(mov.subtipo === 'TRA') {
                decoded_tipo = 'TRASPASO';
              } else if(mov.subtipo === 'COMP') {
                decoded_tipo = 'COMPRA';
              }
            } else if(mov.tipo === 3) {
              if(mov.subtipo === 'DEV') {
                decoded_tipo = 'CANCELACIÓN DE VENTA';
              }
            } else if(mov.tipo === 4) {
              if(mov.subtipo === 'SALE') {
                decoded_tipo = 'VENTA';
              } else if(mov.subtipo === 'GIFT') {
                decoded_tipo = 'CORTESIA';
              }
            }
            
            if(mov.subtipo === 'DEV_GIFT'){
              decoded_tipo = 'CORTESIA CANCELADA';
            }
            if(mov.subtipo === 'MERMA'){
              decoded_tipo = 'MERMA';
            }
            if(mov.subtipo === 'DIR') {
              decoded_tipo = 'Ajuste';
            }
            
            show = show && decoded_tipo.toLowerCase().substring(0, ctrl.subtipo.length) === ctrl.subtipo.toLowerCase();
  
          } else {
            show = false;
          }

        //}

      }

      if( ctrl.comentario.length !== 0 ) {
        if(mov.producto !== undefined && mov.producto !== null) {
          show = show && mov.comments.toLowerCase().indexOf(ctrl.comentario.toLowerCase()) !== -1;
        } else {
          show = false;
        }
      }

      if( ctrl.ticket.length !== 0 ) {
        if(mov.venta !== undefined && mov.venta !== null) {
          show = show && mov.venta.ticket.toString().toLowerCase().substring(0, ctrl.ticket.length) === ctrl.ticket.toLowerCase();
        } else {
          show = false;
        }
      }

      if( ctrl.origin.length !== 0 ) {
        if(mov.desucursal !== undefined && mov.desucursal !== null) {
          show = show && mov.desucursal.name.toLowerCase().substring(0, ctrl.origin.length) === ctrl.origin.toLowerCase();
        } else {
          show = false;
        }
      }

      if( ctrl.dest.length !== 0 ) {
        if(mov.asucursal !== undefined && mov.asucursal !== null) {
          show = show && mov.asucursal.name.toLowerCase().substring(0, ctrl.dest.length) === ctrl.dest.toLowerCase();
        } else {
          show = false;
        }
      }

      return show;
    });
  }

  getDetail(sale): void {
    const dialogRef = this.dialog.open(SaleComponent, {
      width: '400px',
      data: {sale}
    });
  }

  resetFilters(){
    this.ticket = '';
    this.tipo_item = '-';
    this.tipo = '-';
    this.subtipo = '';
    this.origin = '';
    this.dest = '';
    this.nombre = '';
  }

}
