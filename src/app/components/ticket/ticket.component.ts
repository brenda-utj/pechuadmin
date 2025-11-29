import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddTicketComponent } from "./add-ticket/add-ticket.component";
import { TicketService } from "src/app/services/ticket.service";
import { AuthService } from "src/app/services/auth.service";
import { TicketNotificationComponent } from "./ticket-notification/ticket-notification.component";
import { SocketService } from "src/app/services/socket.service";
import { filter } from "rxjs/operators";
import { CredentialModuleService } from "src/app/services/credential-module.service";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.scss"],
})
export class TicketComponent implements OnInit {
  user;
  private joinedRooms = new Set<string>();
  notificationCount: number = 0; // Badge de notificaciones
  notifications: any[] = []; // Aquí unificaremos todas las notificaciones

  tickets: any[] = [];
  ticketsBacklog: any[] = [];
  ticketsPendiente: any[] = [];
  ticketsEnProceso: any[] = [];
  ticketsEnRevision: any[] = [];
  ticketsTerminado: any[] = [];

  // Definir los estados como constantes
  readonly ESTADO_BACKLOG = "backlog";
  readonly ESTADO_PENDIENTE = "pendiente";
  readonly ESTADO_EN_PROCESO = "en proceso";
  readonly ESTADO_EN_REVISION = "en revision";
  readonly ESTADO_TERMINADO = "terminado";

  constructor(
    public dialog: MatDialog,
    private ticketSvc: TicketService,
    private authSvc: AuthService,
    private socketSvc: SocketService,
    private credentialModuleSvc: CredentialModuleService,
  ) {}

  ngOnInit() {
    this.getUser();
    this.listenStatusChanged();
  }

  getUser() {
    // Se filtra para procesar solo valores no nulos/indefinidos
    this.authSvc.user.pipe(filter((u) => !!u)).subscribe((user) => {
      this.user = user; // Asignamos el usuario al componente

      this.credentialModuleSvc.validateUserCredential(this.user , 'ticket.init.init'); //validar credencial

      this.getTickets(); // Solo aquí ya tenemos el user disponible
    });
  }

  getTickets() {
    this.ticketSvc.getTicketsUser(this.user._id).subscribe((res: any[]) => {
      this.tickets = res["tickets"];

      this.updateNotificationCount();

      // Aquí se hace el badge, validando que en los tickets[].notification está una notificación para nuestro usuario:

      // Resetear los arreglos
      this.ticketsBacklog = [];
      this.ticketsPendiente = [];
      this.ticketsEnProceso = [];
      this.ticketsEnRevision = [];
      this.ticketsTerminado = [];

      // Organizar los tickets en los arreglos correspondientes según su estado
      this.tickets.forEach((ticket) => {
        switch (ticket.estado) {
          case this.ESTADO_BACKLOG:
            this.ticketsBacklog.push(ticket);
            break;
          case this.ESTADO_PENDIENTE:
            this.ticketsPendiente.push(ticket);
            break;
          case this.ESTADO_EN_PROCESO:
            this.ticketsEnProceso.push(ticket);
            break;
          case this.ESTADO_EN_REVISION:
            this.ticketsEnRevision.push(ticket);
            break;
          case this.ESTADO_TERMINADO:
            this.ticketsTerminado.push(ticket);
            break;
          default:
            // Si el estado es desconocido, lo agregamos a 'inicial' o puedes manejarlo como desees
            this.ticketsBacklog.push(ticket);
            break;
        }

        if (!this.joinedRooms.has(ticket._id)) {
          this.socketSvc.joinTicketRoom(ticket._id);
          this.joinedRooms.add(ticket._id);
        }
      });
    });
  }

  private updateNotificationCount(): void {
    let count = 0;

    // Recorrer tickets
    this.tickets.forEach((ticket) => {
      // Verificar si el ticket tiene un array notifications
      if (ticket.notifications && Array.isArray(ticket.notifications)) {
        // Recorrer cada notificación
        ticket.notifications.forEach((notif) => {
          if (notif.user._id !== this.user._id) {
            // Buscar al usuario con userId = this.user._id y read = false
            if (notif.users && Array.isArray(notif.users)) {
              const notReadByUser = notif.users.some(
                (u) => u.userId === this.user._id && u.read === false
              );
              if (notReadByUser) {
                count++;
              }
            }
          }
        });
      }
    });

    this.notificationCount = count;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Si se reordena dentro de la misma lista
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Si se mueve a otra lista
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Actualizar el estado del ticket
      const ticket = event.container.data[event.currentIndex];
      const newEstado = event.container.id;

      if (ticket.estado !== newEstado) {
        ticket.estado = newEstado;

        // Actualizar el ticket en el servidor
        this.ticketSvc
          .updateTicket(ticket._id, { estado: newEstado }, this.user)
          .subscribe(
            (res) => {
              this.ticketSvc
                .addNotification(ticket._id, res["notification"])
                .subscribe(
                  (resNotif) => {},
                  (errNotif) => {
                    console.error("Error al crear notificación", errNotif);
                  }
                );
            },
            (err) => {
              console.error("Error al actualizar el ticket", err);
            }
          );
      }
    }
  }

  canEnterTerminado = (drag, drop) => {
    if (drag.dropContainer === drop) {
      return true;
    }

    // Ticket REAL arrastrado
    const draggedTicket =
      (drag.data && drag.data.userAdd && drag.data.userAdd._id) || null;
    if (!draggedTicket) {
      return false;
    }

    // Valida si el usuario creó el ticket
    if (draggedTicket === this.user._id) {
      return true; // permitir soltar
    }

    return false; // bloquear
  };

  openDialogCreate() {
    const dialogRef = this.dialog.open(AddTicketComponent, {
      width: "90%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTickets();
    });
  }

  openTicketDialog(ticket: any) {
    ticket["tipoModal"] = "edit";
    const dialogRef = this.dialog.open(AddTicketComponent, {
      width: "90%",
      data: ticket,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTickets();
    });
  }

  openDialogNotification() {
    const dialogRef = this.dialog.open(TicketNotificationComponent, {
      width: "90%",
      data: " ",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((closed) => {
      this.getTickets();
    });
  }

  listenStatusChanged() {
    this.socketSvc.onTicketNotification((notif) => {
      this.ngOnInit();
      this.getTickets();
    });
  }
}
