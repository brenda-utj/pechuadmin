import { LayoutComponent } from "./layout/layout.component";
import { Component, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./components/main/main.component";
import { UsersComponent } from "./components/users/users.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { ModulosComponent } from "./components/modulos/modulos.component";
import { CredencialesComponent } from "./components/credenciales/credenciales.component";
import { AssignCredencialesComponent } from "./components/credenciales/assign-credenciales/assign-credenciales.component";
import { ErrorComponent } from "./components/error/error.component";
import { EventsComponent } from "./components/events/events.component";
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { HomeComponent } from "./components/home/home.component";
import { NotesComponent } from "./components/notes/notes.component";
import { ReportsComponent } from "./components/reports/reports.component";
import { AddNoteComponent } from "./components/notes/add-note/add-note.component";
import { AddReportComponent } from "./components/reports/add-report/add-report.component";

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
        path: "",
        redirectTo: "vacantes",
        pathMatch: "full",
      },
      {
        path: "usuarios",
        component: UsersComponent,
        data: {
          heading: "Administrar usuarios",
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
        path: "notes",
        component: NotesComponent,
        data: {
          heading: "Mis notas",
        },
      },
      {
        path: "notes/add",
        component: AddNoteComponent,
        data: { heading: "Agregar Nota" },
      },
      {
        path: "notes/edit/:id",
        component: AddNoteComponent,
        data: { heading: "Editar Nota" },
      },
      {
        path: "reports",
        component: ReportsComponent,
        data: {
          heading: "Lista de Reportes",
        },
      },
      {
        path: "reports/add",
        component: AddReportComponent,
        data: { heading: "Generar Reporte" },
      },
      {
        path: "reports/edit/:id",
        component: AddReportComponent,
        data: { heading: "Editar Reporte" },
      },
      {
        path: "events/calendar",
        component: CalendarComponent,
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
