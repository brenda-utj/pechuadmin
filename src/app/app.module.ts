import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MomentModule } from "ngx-moment";
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';

// Componentes del proyecto
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainComponent } from "./components/main/main.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthService } from "./services/auth.service";
import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { ZonesService } from "./services/zones.service";
import { UsersComponent } from "./components/users/users.component";
import { AddUserComponent } from "./components/users/add-user/add-user.component";
import { UserService } from "./services/user.service";
import { ExcelService } from "./services/excel.service";
import { ImageService } from "./services/image.service";
import { FilterPipe } from "./services/filter.pipe";
import { LayoutComponent } from "./layout/layout.component";
import { InicioComponent } from "./components/inicio/inicio.component";
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
import { UsersModule } from './components/users/users.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { ModulosModule } from './components/modulos/modulos.module';
import { MapModule } from './components/map/map.module';
import { LoginModule } from './components/login/login.module';
import { EventsModule } from './components/events/events.module';
import { AddressSearchModule } from './components/address-search/address-search.module';
import { CredencialesModule } from './components/credenciales/credenciales.module';
import { CalendarModule } from './components/calendar/calendar.module';
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
    LoginComponent,
    UsersComponent,
    AddUserComponent,
    LayoutComponent,
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
        UsersModule,
        SidebarModule,
        MapModule,
        LoginModule,
        EventsModule,
        AddressSearchModule,
        CredencialesModule,
        CalendarModule,], 
        providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
        AuthService,
        ZonesService,
        UserService,
        ExcelService,
        ImageService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
    
 })
export class AppModule {}
