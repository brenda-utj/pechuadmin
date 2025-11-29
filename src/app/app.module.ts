import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MomentModule } from "ngx-moment";
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from "./app-routing.module";

// Componentes del proyecto
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainComponent } from "./components/main/main.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { DefaultComponent } from "./components/default/default.component";
import { MateriasComponent } from "./components/materias/materias.component";
import { ProductComponent } from "./components/product/product.component";
import { ZoneComponent } from "./components/zone/zone.component";
import { SucursalComponent } from "./components/sucursal/sucursal.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthService } from "./services/auth.service";
import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { AddMateriasComponent } from "./components/materias/addmateria.component";
import { ProductsService } from "./services/products.service";
import { AddProductComponent } from "./components/product/addproduct.component";
import { ZonesService } from "./services/zones.service";
import { InventoryComponent } from "./components/inventory/inventory.component";
import { AddsucursalComponent } from "./components/sucursal/addsucursal/addsucursal.component";
import { SalesComponent } from "./components/sales/sales.component";
import { UsersComponent } from "./components/users/users.component";
import { AddUserComponent } from "./components/users/add-user/add-user.component";
import { UserService } from "./services/user.service";
import { CategoryComponent } from "./components/category/category.component";
import { ExcelService } from "./services/excel.service";
import { MateriasListComponent } from "./components/product/materias-list/materias-list.component";
import { ImageService } from "./services/image.service";
import { CurrentComponent } from "./components/current/current.component";
import { SelectSucursalComponent } from "./components/current/select-sucursal/select-sucursal.component";
import { NewItemComponent } from "./components/current/new-item/new-item.component";
import { TraspasosComponent } from "./components/traspasos/traspasos.component";
import { RecurrentesComponent } from "./components/recurrentes/recurrentes.component";
import { CajaService } from "./services/caja.service";
import { CuponesComponent } from "./components/cupones/cupones.component";
import { CuponService } from "./services/cupon.service";
import { FilterPipe } from "./services/filter.pipe";
import { SucListComponent } from "./components/current/suc-list/suc-list.component";
import { MovimientosComponent } from "./components/movimientos/movimientos.component";
import { CajasComponent } from "./components/cajas/cajas.component";
import { SalesReportComponent } from "./components/sales-report/sales-report.component";
import { LayoutComponent } from "./layout/layout.component";
import { SalesHistoryComponent } from "./components/sales-history/sales-history.component";
import { SaleComponent } from "./components/sale/sale.component";
import { InventoryMovementsComponent } from "./components/inventory-movements/inventory-movements.component";
import { MoneyBoxMovementsComponent } from "./components/moneybox-movements/moneybox-movements.component";
import { SalesAnalisisComponent } from "./components/sales-analisis/sales-analisis.component";
import { NameComponent } from "./components/name/name.component";
import { EmployeesComponent } from "./components/employee/employee.component";
import { AddEmployeeComponent } from "./components/employee/add-employee/add-employee.component";
import { NominasComponent } from "./components/nominas/nominas.component";
import { AddNominaComponent } from "./components/nominas/add-nomina/add-nomina.component";
import { SeeNominaComponent } from "./components/nominas/see-nomina/see-nomina.component";
import { ProductAnalisisComponent } from "./components/product-analisis/product-analisis.component";
import { OpinionesComponent } from "./components/opiniones/opiniones.component";
import { IdentitiesComponent } from "./components/identities/identities.component";
import { IdentitiesAdminComponent } from "./components/identities-admin/identities-admin.component";
import { AuthorizationsComponent } from "./components/authorizations/authorizations.component";
import { PastInventoriesComponent } from "./components/past-inventories/past-inventories.component";
import { ItemNamesComponent } from "./components/item-names/item-names.component";
import { ChecksBranchComponent } from "./components/checks-branch/checks-branch.component";
import { EditChecksComponent } from "./components/checks-branch/edit-checks/edit-checks.component";
import { ActividadService } from "./services/actividad.service";
import { InventoriesReportComponent } from "./components/inventories-report/inventories-report.component";
import { ActivityReportComponent } from "./components/activity-report/activity-report.component";
import { ResumenComponent } from "./components/resumen/resumen.component";
import { RemissionsHistoryComponent } from "./components/remissions-history/remissions-history.component";
import { RevisionReportComponent } from "./components/revision-report/revision-report.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { DepositosComponent } from "./components/depositos/depositos.component";
import { AdddepositoComponent } from "./components/depositos/adddeposito/adddeposito.component";
import { EditdepositoComponent } from "./components/depositos/editdeposito/editdeposito.component";
import { TipoSubtipoComponent } from "./components/tipo-subtipo/tipo-subtipo.component";
import { AddTipoComponent } from "./components/tipo-subtipo/add-tipo/add-tipo.component";
import { ProveedoresComponent } from "./components/proveedores/proveedores.component";
import { AddProveedorComponent } from "./components/proveedores/add-proveedor/add-proveedor.component";
import { ComprasComponent } from "./components/compras/compras.component";
import { AddComprasComponent } from "./components/compras/add-compras/add-compras.component";
import { AbonosComponent } from "./components/abonos/abonos.component";
import { EditComprasComponent } from "./components/compras/edit-compras/edit-compras.component";
import { GastosComponent } from "./components/gastos/gastos.component";
import { AddGastosComponent } from "./components/gastos/add-gastos/add-gastos.component";
import { EditGastoComponent } from "./components/gastos/edit-gasto/edit-gasto.component";
import { SalesBranchComponent } from './components/sales-branch/sales-branch.component';
import { ActivityTemplatesComponent } from './components/activity-templates/activity-templates.component';
import { AddActivityTemplatesComponent } from './components/activity-templates/add-activity-templates/add-activity-templates.component';
import { TipoEmpleadoComponent } from './components/tipo-empleado/tipo-empleado.component';
import { AddTipoEmpleadoComponent } from './components/tipo-empleado/add-tipo-empleado/add-tipo-empleado.component';
import { PuestosComponent } from './components/puestos/puestos.component';
import { AddPuestoComponent } from './components/puestos/add-puesto/add-puesto.component';
import { AlianzasComponent } from './components/alianzas/alianzas.component';
import { AlianzasDetailsComponent } from './components/alianzas/alianzas-details/alianzas-details.component';
import { TipoContratoComponent } from "./components/tipo-contrato/tipo-contrato.component";
import { AddTipoContratoComponent } from "./components/tipo-contrato/add-tipo-contrato/add-tipo-contrato.component";
import { DinamicConfigComponent } from './components/dinamic-config/dinamic-config.component';
import { DinamicReportComponent } from './components/dinamic-report/dinamic-report.component';
import { VacanteComponent  } from "./components/vacantes/vacante.component";
import { AddVacanteComponent } from "./components/vacantes/add-vacante/add-vacante.component";
import { ShowVacanteComponent } from './components/vacantes/show-vacante/show-vacante.component';
import { DepartamentoComponent } from './components/departamento/departamento.component';
import { AddDepartamentoComponent } from './components/departamento/add-departamento/add-departamento.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { AddTicketComponent } from './components/ticket/add-ticket/add-ticket.component';
import { TicketNotificationComponent } from './components/ticket/ticket-notification/ticket-notification.component';
import { ChikenRangeComponent } from './components/chiken-range/chiken-range.component';
import { AddChikenRangeComponent } from './components/chiken-range/add-chiken-range/add-chiken-range.component';
import { ReferralsComponent } from './components/referrals/referrals.component';
import { AddReferralsComponent } from './components/referrals/add-referrals/add-referrals.component';
import { ModulosComponent } from './components/modulos/modulos.component';
import { AddModuloComponent } from './components/modulos/add-modulo/add-modulo.component';
import { CredencialesComponent } from './components/credenciales/credenciales.component';
import { AddCredencialesComponent } from './components/credenciales/add-credenciales/add-credenciales.component';
import { AssignCredencialesComponent } from './components/credenciales/assign-credenciales/assign-credenciales.component';
import { ErrorComponent } from './components/error/error.component';
import { EventsComponent } from './components/events/events.component';
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { ShowEventComponent } from './components/events/show-event/show-event.component';
import { MapComponent } from './components/map/map.component';
import { AddressSearchComponent } from './components/address-search/address-search.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LayoutModule } from './layout/layout.module';
import { ZoneModule } from './components/zone/zone.module';
import { VacantesModule } from './components/vacantes/vacantes.module';
import { UsersModule } from './components/users/users.module';
import { TraspasosModule } from './components/traspasos/traspasos.module';
import { TipoSubtipoModule } from './components/tipo-subtipo/tipo-subtipo.module';
import { TipoEmpleadoModule } from './components/tipo-empleado/tipo-empleado.module';
import { TipoContratoModule } from './components/tipo-contrato/tipo-contrato.module';
import { TicketModule } from './components/ticket/ticket.module';
import { SucursalModule } from './components/sucursal/sucursal.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { SalesModule } from './components/sales/sales.module';
import { SalesReportModule } from './components/sales-report/sales-report.module';
import { SalesHistoryModule } from './components/sales-history/sales-history.module';
import { SalesBranchModule } from './components/sales-branch/sales-branch.module';
import { SalesAnalisisModule } from './components/sales-analisis/sales-analisis.module';
import { SaleModule } from './components/sale/sale.module';
import { RevisionReportModule } from './components/revision-report/revision-report.module';
import { ResumenModule } from './components/resumen/resumen.module';
import { RemissionsHistoryModule } from './components/remissions-history/remissions-history.module';
import { ReferralsModule } from './components/referrals/referrals.module';
import { RecurrentesModule } from './components/recurrentes/recurrentes.module';
import { PuestosModule } from './components/puestos/puestos.module';
import { ProveedoresModule } from './components/proveedores/proveedores.module';
import { ProductModule } from './components/product/product.module';
import { ProductAnalisisModule } from './components/product-analisis/product-analisis.module';
import { PastInventoriesModule } from './components/past-inventories/past-inventories.module';
import { OpinionesModule } from './components/opiniones/opiniones.module';
import { NominasModule } from './components/nominas/nominas.module';
import { NameModule } from './components/name/name.module';
import { MovimientosModule } from './components/movimientos/movimientos.module';
import { MoneyboxMovementsModule } from './components/moneybox-movements/moneybox-movements.module';
import { ModulosModule } from './components/modulos/modulos.module';
import { MateriasModule } from './components/materias/materias.module';
import { MapModule } from './components/map/map.module';
import { LoginModule } from './components/login/login.module';
import { ItemNamesModule } from './components/item-names/item-names.module';
import { InventoryMovementsModule } from './components/inventory-movements/inventory-movements.module';
import { InventoryModule } from './components/inventory/inventory.module';
import { InventoriesReportModule } from './components/inventories-report/inventories-report.module';
import { IdentitiesModule } from './components/identities/identities.module';
import { IdentitiesAdminModule } from './components/identities-admin/identities-admin.module';
import { GastosModule } from './components/gastos/gastos.module';
import { EventsModule } from './components/events/events.module';
import { AddressSearchModule } from './components/address-search/address-search.module';
import { EmployeeModule } from './components/employee/employee.module';
import { DinamicReportModule } from './components/dinamic-report/dinamic-report.module';
import { DinamicConfigModule } from './components/dinamic-config/dinamic-config.module';
import { DepositosModule } from './components/depositos/depositos.module';
import { DepartamentoModule } from './components/departamento/departamento.module';
import { CurrentModule } from './components/current/current.module';
import { CuponesModule } from './components/cupones/cupones.module';
import { CredencialesModule } from './components/credenciales/credenciales.module';
import { ComprasModule } from './components/compras/compras.module';
import { ChikenRangeModule } from './components/chiken-range/chiken-range.module';
import { ChecksBranchModule } from './components/checks-branch/checks-branch.module';
import { CategoryModule } from './components/category/category.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { CajasModule } from './components/cajas/cajas.module';
import { AuthorizationsModule } from './components/authorizations/authorizations.module';
import { AlianzasModule } from './components/alianzas/alianzas.module';
import { ActivityTemplatesModule } from './components/activity-templates/activity-templates.module';
import { ActivityReportModule } from './components/activity-report/activity-report.module';
import { AbonosModule } from './components/abonos/abonos.module';
import { HomeComponent } from "./components/home/home.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular';
//import { MaterialTimePickerComponent } from "@candidosales/material-time-picker";



// Agrupa componentes por categoría
const COMPONENTS = [
    MainComponent,
    InicioComponent,
    SidebarComponent,
    DefaultComponent,
    MateriasComponent,
    ProductComponent,
    ZoneComponent,
    SucursalComponent,
    LoginComponent,
    AddMateriasComponent,
    AddProductComponent,
    InventoryComponent,
    AddsucursalComponent,
    SalesComponent,
    UsersComponent,
    AddUserComponent,
    CategoryComponent,
    MateriasListComponent,
    CurrentComponent,
    SelectSucursalComponent,
    NewItemComponent,
    TraspasosComponent,
    RecurrentesComponent,
    CuponesComponent,
    FilterPipe,
    SucListComponent,
    MovimientosComponent,
    CajasComponent,
    SalesReportComponent,
    SalesAnalisisComponent,
    LayoutComponent,
    SalesHistoryComponent,
    SaleComponent,
    InventoryMovementsComponent,
    MoneyBoxMovementsComponent,
    NameComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    NominasComponent,
    AddNominaComponent,
    SeeNominaComponent,
    ProductAnalisisComponent,
    OpinionesComponent,
    IdentitiesComponent,
    IdentitiesAdminComponent,
    AuthorizationsComponent,
    PastInventoriesComponent,
    ItemNamesComponent,
    ChecksBranchComponent,
    EditChecksComponent,
    InventoriesReportComponent,
    ActivityReportComponent,
    ResumenComponent,
    RemissionsHistoryComponent,
    RevisionReportComponent,
    DepositosComponent,
    AdddepositoComponent,
    EditdepositoComponent,
    TipoSubtipoComponent,
    AddTipoComponent,
    ProveedoresComponent,
    AddProveedorComponent,
    ComprasComponent,
    AddComprasComponent,
    AbonosComponent,
    EditComprasComponent,
    GastosComponent,
    AddGastosComponent,
    EditGastoComponent,
    SalesBranchComponent,
    ActivityTemplatesComponent,
    AddActivityTemplatesComponent,
    TipoEmpleadoComponent,
    AddTipoEmpleadoComponent,
    PuestosComponent,
    AddPuestoComponent,
    AlianzasComponent,
    AlianzasDetailsComponent,
    TipoContratoComponent,
    AddTipoContratoComponent,
    DinamicConfigComponent,
    DinamicReportComponent,
    DepartamentoComponent,
    AddDepartamentoComponent,
    TicketComponent,
    AddTicketComponent,
    TicketNotificationComponent,
    ChikenRangeComponent,
    AddChikenRangeComponent,
    ReferralsComponent,
    AddReferralsComponent,
    ModulosComponent,
    AddModuloComponent,
    CredencialesComponent,
    AddCredencialesComponent,
    AssignCredencialesComponent,
    ErrorComponent,
    EventsComponent,
    AddEventComponent,
    ShowEventComponent,
    MapComponent,
    AddressSearchComponent,
    CalendarComponent,
    VacanteComponent,
    AddVacanteComponent,
    ShowVacanteComponent,
    HomeComponent,
];

@NgModule({ declarations: [
        AppComponent,
        //...COMPONENTS
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        AppRoutingModule,
        RouterModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        FullCalendarModule,

        // Mantén estos que son específicos o de terceros:
        NgxSpinnerModule,
        MomentModule,
        LayoutModule,
        ZoneModule,
        VacantesModule,
        UsersModule,
        TraspasosModule,
        TipoSubtipoModule,
        TipoEmpleadoModule,
        TipoContratoModule,
        TicketModule,
        SucursalModule,
        SidebarModule,
        SalesModule,
        SalesReportModule,
        SalesHistoryModule,
        SalesBranchModule,
        SalesAnalisisModule,
        SaleModule,
        RevisionReportModule,
        ResumenModule,
        RemissionsHistoryModule,
        ReferralsModule,
        RecurrentesModule,
        PuestosModule,
        ProveedoresModule,
        ProductModule,
        ProductAnalisisModule,
        PastInventoriesModule,
        OpinionesModule,
        NominasModule,
        NameModule,
        MovimientosModule,
        MoneyboxMovementsModule,
        ModulosModule,
        MateriasModule,
        MapModule,
        LoginModule,
        ItemNamesModule,
        InventoryMovementsModule,
        InventoryModule,
        InventoriesReportModule,
        IdentitiesModule,
        IdentitiesAdminModule,
        GastosModule,
        EventsModule,
        AddressSearchModule,
        EmployeeModule,
        DinamicReportModule,
        DinamicConfigModule,
        DepositosModule,
        DepartamentoModule,
        CurrentModule,
        CuponesModule,
        CredencialesModule,
        ComprasModule,
        ChikenRangeModule,
        ChecksBranchModule,
        CategoryModule,
        CalendarModule,
        CajasModule,
        AuthorizationsModule,
        AlianzasModule,
        ActivityTemplatesModule,
        ActivityReportModule,
        AbonosModule], 
        providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
        AuthService,
        ProductsService,
        ZonesService,
        UserService,
        ExcelService,
        ImageService,
        CajaService,
        CuponService,
        ActividadService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
    
 })
export class AppModule {}
