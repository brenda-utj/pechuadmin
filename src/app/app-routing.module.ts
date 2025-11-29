import { LayoutComponent } from "./layout/layout.component";
import { Component, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalesReportComponent } from "./components/sales-report/sales-report.component";
import { MainComponent } from "./components/main/main.component";
import { DefaultComponent } from "./components/default/default.component";
import { MateriasComponent } from "./components/materias/materias.component";
import { ProductComponent } from "./components/product/product.component";
import { ZoneComponent } from "./components/zone/zone.component";
import { SucursalComponent } from "./components/sucursal/sucursal.component";
import { SalesComponent } from "./components/sales/sales.component";
import { UsersComponent } from "./components/users/users.component";
import { CategoryComponent } from "./components/category/category.component";
import { CurrentComponent } from "./components/current/current.component";
import { TraspasosComponent } from "./components/traspasos/traspasos.component";
import { RecurrentesComponent } from "./components/recurrentes/recurrentes.component";
import { CuponesComponent } from "./components/cupones/cupones.component";
import { MovimientosComponent } from "./components/movimientos/movimientos.component";
import { CajasComponent } from "./components/cajas/cajas.component";
import { SalesHistoryComponent } from "./components/sales-history/sales-history.component";
import { InventoryMovementsComponent } from "./components/inventory-movements/inventory-movements.component";
import { MoneyBoxMovementsComponent } from "./components/moneybox-movements/moneybox-movements.component";
import { SalesAnalisisComponent } from "./components/sales-analisis/sales-analisis.component";
import { NameComponent } from "./components/name/name.component";
import { EmployeesComponent } from "./components/employee/employee.component";
import { NominasComponent } from "./components/nominas/nominas.component";
import { ProductAnalisisComponent } from "./components/product-analisis/product-analisis.component";
import { OpinionesComponent } from "./components/opiniones/opiniones.component";
import { IdentitiesComponent } from "./components/identities/identities.component";
import { AuthorizationsComponent } from "./components/authorizations/authorizations.component";
import { PastInventoriesComponent } from "./components/past-inventories/past-inventories.component";
import { ItemNamesComponent } from "./components/item-names/item-names.component";
import { ChecksBranchComponent } from "./components/checks-branch/checks-branch.component";
import { InventoriesReportComponent } from "./components/inventories-report/inventories-report.component";
import { ActivityReportComponent } from "./components/activity-report/activity-report.component";
import { ResumenComponent } from "./components/resumen/resumen.component";
import { RemissionsHistoryComponent } from "./components/remissions-history/remissions-history.component";
import { IdentitiesAdminComponent } from "./components/identities-admin/identities-admin.component";
import { RevisionReportComponent } from "./components/revision-report/revision-report.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { TipoSubtipoComponent } from "./components/tipo-subtipo/tipo-subtipo.component";
import { DepositosComponent } from "./components/depositos/depositos.component";
import { ProveedoresComponent } from "./components/proveedores/proveedores.component";
import { ComprasComponent } from "./components/compras/compras.component";
import { GastosComponent } from "./components/gastos/gastos.component";
import { SalesBranchComponent } from './components/sales-branch/sales-branch.component';
import { ActivityTemplatesComponent } from './components/activity-templates/activity-templates.component';
import { TipoEmpleadoComponent } from './components/tipo-empleado/tipo-empleado.component';
import { PuestosComponent } from './components/puestos/puestos.component';
import { AlianzasComponent } from './components/alianzas/alianzas.component';
import { TipoContratoComponent } from "./components/tipo-contrato/tipo-contrato.component";
import { DinamicConfigComponent } from "./components/dinamic-config/dinamic-config.component";
import { DinamicReportComponent } from "./components/dinamic-report/dinamic-report.component";
import { VacanteComponent } from './components/vacantes/vacante.component';
import { AddVacanteComponent } from './components/vacantes/add-vacante/add-vacante.component';
import { DepartamentoComponent } from "./components/departamento/departamento.component";
import { TicketComponent } from "./components/ticket/ticket.component";
import { ModulosComponent } from "./components/modulos/modulos.component";
import { CredencialesComponent } from "./components/credenciales/credenciales.component";
import { AssignCredencialesComponent } from "./components/credenciales/assign-credenciales/assign-credenciales.component";
import { ErrorComponent } from "./components/error/error.component";
import { EventsComponent } from "./components/events/events.component";
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ChikenRangeComponent } from "./components/chiken-range/chiken-range.component";
import { ReferralsComponent } from "./components/referrals/referrals.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: InicioComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "sales-report",
        component: SalesReportComponent,
        data: {
          heading: "Reporte de ventas",
        },
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "sales-analisis",
        component: SalesAnalisisComponent,
        data: {
          heading: "Análisis de operación",
        },
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "product-analisis",
        component: ProductAnalisisComponent,
        data: {
          heading: "Analisis de productos",
        },
      },
      {
        path: "opiniones",
        component: OpinionesComponent,
        data: {
          heading: "Opiniones",
        },
      },
      {
        path: "vacantes",
        component: VacanteComponent,
        data: { heading: "Vacantes" },
      },
      {
        path: "vacantes/add",
        component: AddVacanteComponent,
        data: { heading: "Agregar Vacante" },
      },
      {
        path: "vacantes/edit/:id",
        component: AddVacanteComponent,
        data: { heading: "Editar Vacante" },
      },
      {
        path: "",
        redirectTo: "vacantes",
        pathMatch: "full",
      },
      {
        path: "sales-history",
        component: SalesHistoryComponent,
        data: {
          heading: "Histórico de ventas",
        },
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "inventory-movements",
        component: InventoryMovementsComponent,
        data: {
          heading: "Movimientos de inventario",
        },
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "moneybox-movements",
        component: MoneyBoxMovementsComponent,
        data: {
          heading: "Movimientos de caja",
        },
        // canActivate: [AuthGuard],
        // data: {
        //   expectedRoles: [Roles.USER, Roles.ADMIN]
        // }
      },
      {
        path: "zonas",
        component: ZoneComponent,
        data: {
          heading: "Administrar zonas",
        },
      },
      {
        path: "sucursales",
        component: SucursalComponent,
        data: {
          heading: "Administrar sucursales",
        },
      },
      {
        path: "productos",
        component: ProductComponent,
        data: {
          heading: "Administrar productos",
        },
      },
      {
        path: "materia-prima",
        component: MateriasComponent,
        data: {
          heading: "Administrar materias primas",
        },
      },
      {
        path: "categorias",
        component: CategoryComponent,
        data: {
          heading: "Categorías / Unidades",
        },
      },
      {
        path: "sucursal",
        component: CurrentComponent,
        data: {
          heading: "Administrar menu",
        },
      },
      {
        path: "names",
        component: NameComponent,
        data: {
          heading: "Nombres",
        },
      },
      {
        path: "usuarios",
        component: UsersComponent,
        data: {
          heading: "Administrar usuarios",
        },
      },
      {
        path: "empleados",
        component: EmployeesComponent,
        data: {
          heading: "Administrar empleados",
        },
      },
      {
        path: "nominas",
        component: NominasComponent,
        data: {
          heading: "Administrar nóminas",
        },
      },
      {
        path: "identities",
        component: IdentitiesComponent,
        data: {
          heading: "Sesiones abiertas (POS)",
        },
      },
      {
        path: "identities-admin",
        component: IdentitiesAdminComponent,
        data: {
          heading: "Sesiones Admin",
        },
      },
      {
        path: "authorizations",
        component: AuthorizationsComponent,
        data: {
          heading: "Registro de autorizaciones",
        },
      },
      {
        path: "inventories",
        component: PastInventoriesComponent,
        data: {
          heading: "Registro de Inventarios (al finalizar)",
        },
      },
      {
        path: "item-names",
        component: ItemNamesComponent,
        data: {
          heading: "Nombres de paquetes",
        },
      },
      {
        path: "checks-branch",
        component: ChecksBranchComponent,
        data: {
          heading: "Lista de actividades",
        },
      },
      {
        path: "inventories-report",
        component: InventoriesReportComponent,
        data: {
          heading: "Reporte de inventarios",
        },
      },
      {
        path: "activity-report",
        component: ActivityReportComponent,
        data: {
          heading: "Reporte de actividades",
        },
      },
      {
        path: "revision-report",
        component: RevisionReportComponent,
        data: {
          heading: "Reporte de revisiones",
        },
      },
      {
        path: "resumen",
        component: ResumenComponent,
        data: {
          heading: "Resumen",
        },
      },
      {
        path: "proveedores",
        component: ProveedoresComponent,
        data: {
          heading: "Catálogo de proveedores",
        },
      },
      {
        path: "remissions-history",
        component: RemissionsHistoryComponent,
        data: {
          heading: "Historial de remisiones",
        },
      },
      {
        path: "depositos",
        component: DepositosComponent,
        data: {
          heading: "Depósitos",
        },
      },
      {
        path: "tipo-subtipo",
        component: TipoSubtipoComponent,
        data: {
          heading: "Catálogo de tipos y subtipos",
        },
      },
      {
        path: "compras",
        component: ComprasComponent,
        data: {
          heading: "Módulo de compras",
        },
      },
      {
        path: "gastos",
        component: GastosComponent,
        data: {
          heading: "Módulo de gastos",
        },
      },
      {
        path: "sales-branch",
        component: SalesBranchComponent,
        data: {
          heading: "Ventas por sucursal",
        },
      },
      {
        path: "activity-templates",
        component: ActivityTemplatesComponent,
        data: {
          heading: "Plantillas Actividades",
        },
      },
      {
        path: "tipo-empleado",
        component: TipoEmpleadoComponent,
        data: {
          heading: "Tipos de empleados",
        },
      },
      {
        path: "tipo-contrato",
        component: TipoContratoComponent,
        data: {
          heading: "Tipos de contratos",
        },
      },
      {
        path: "puestos",
        component: PuestosComponent,
        data: {
          heading: "Puestos",
        },
      },
      {
        path: "alianzas",
        component: AlianzasComponent,
        data: {
          heading: "Alianzas",
        },
      },
      {
        path: "conf-reporte",
        component: DinamicConfigComponent,
        data: {
          heading: "Configuración reporte dinámico",
        },
      },
      {
        path: "reporte-din",
        component: DinamicReportComponent,
        data: {
          heading: "Reporte dinámico",
        },
      },
      {
        path: "departamentos",
        component: DepartamentoComponent,
        data: {
          heading: "Departamentos",
        },
      },
      {
        path: "ticket",
        component: TicketComponent,
        data: {
          heading: "Tickets",
        },
      },
      {
        path: "modulos",
        component: ModulosComponent,
        data: {
          heading: "Modulos",
        },
      },
      {
        path: "credenciales",
        component: CredencialesComponent,
        data: {
          heading: "Credenciales",
        },
      },
      {
        path: "asignar-credencial",
        component: AssignCredencialesComponent,
        data: {
          heading: "Asignar Credenciales",
        },
      },
      {
        path: "error",
        component: ErrorComponent,
        data: {
          heading: "Error",
        },
      },
      {
        path: "events",
        component: EventsComponent,
        data: {
          heading: "Lista de eventos",
        },
      },
      {
        path: "events/add",
        component: AddEventComponent,
        data: { heading: "Agregar Evento" },
      },
      {
        path: "events/edit/:id",
        component: AddEventComponent,
        data: { heading: "Editar Evento" },
      },
      {
        path: "events/calendar",
        component: CalendarComponent,
      },
      {
        path: "chiken-range",
        component: ChikenRangeComponent,
        data: {
          heading: "Rango Pollo",
        },
      },
      {
        path: "referrals",
        component: ReferralsComponent,
        data: {
          heading: "Remisiones",
        },
      },
      {
        path: "home",
        component: HomeComponent,
        data: {
          heading: "Home",
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      useHash: true,  // Recomendado para evitar problemas
      enableTracing: false  // Actívalo solo para debug
    })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
