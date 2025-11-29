import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { SocketService } from "src/app/services/socket.service";
import { TicketService } from "src/app/services/ticket.service";
import { ZonesService } from "src/app/services/zones.service";
import { AddTicketComponent } from "../add-ticket/add-ticket.component";

@Component({
  selector: "app-ticket-notification",
  templateUrl: "./ticket-notification.component.html",
  styleUrls: ["./ticket-notification.component.scss"],
})
export class TicketNotificationComponent implements OnInit {
  user: any;
  tickets: any[] = [];
  notifications: any[] = [];

  // Filtro de la vista actual: "unread" (no leídos) o "all" (todos)
  filterType: string = "unread";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TicketNotificationComponent>,
    private dialog: MatDialog,
    private zonesSvc: ZonesService,
    private authSvc: AuthService,
    private socketSvc: SocketService,
    private ticketSvc: TicketService
  ) {}

  ngOnInit() {
    this.getUser();
    this.listenNotifications(); // Escuchar notificaciones en tiempo real
  }

  getUser() {
    this.authSvc.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getTickets();
      }
    });
  }

  getTickets() {
    this.ticketSvc.getTicketsUser(this.user._id).subscribe((res: any) => {
      this.tickets = res["tickets"];
      // Unir a las salas
      this.joinRooms(this.tickets);
      // Cargar notificaciones locales
      this.loadLocalNotifications(this.tickets);
    });
  }

  joinRooms(tickets: any[]) {
    const roomIds = tickets.map((t) => `ticket_${t._id}`);
    this.socketSvc.joinCloseTicket(roomIds);
  }

  openTicketDialog(ticketId: string) {
    let aux = "edit";
    this.ticketSvc.getTicketById(ticketId).subscribe((ticket: any) => {
      ticket['tipoModal'] = aux;
      const dialogRef = this.dialog.open(AddTicketComponent, {
        width: '90%',
        data: ticket,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(() => {
      });
    });
  }

  loadLocalNotifications(tickets: any[]) {
    this.notifications = [];
    tickets.forEach((ticket) => {
      if (ticket.notifications && Array.isArray(ticket.notifications)) {
        ticket.notifications.forEach((notif) => {
          this.notifications.push({
            ticketId: ticket._id,
            ...notif,
          });
        });
      }
    });
  }

  listenNotifications() {
    this.socketSvc.onTicketNotification((notif) => {
      this.notifications.push(notif);
    });
  }

  get filteredNotifications(): any[] {
    // Creamos una copia del arreglo para no mutar el original
    let notifs = [...this.notifications];
  
    // Filtrar según el tipo
    if (this.filterType === "unread") {
      notifs = notifs.filter((n) => this.isNotRead(n));
    }
  
    JSON.stringify('');
    // Invertimos el orden para que salgan las más recientes primero    
    return notifs.reverse();
  }
  
  isNotRead(notif: any): boolean {
    if (!notif.users || !Array.isArray(notif.users)) return false;
    // Buscar si mi user._id está en la lista con read=false
    const found = notif.users.find(
      (u: any) => u.userId === this.user._id && u.read === false
    );
    return !!found; // true si existe uno
  }

  markAsRead(notif: any) {
    this.ticketSvc
      .markNotificationAsRead(notif._id, this.user._id, notif.ticketId)
      .subscribe(
        () => {
          // Actualizar localmente
          if (notif.users && Array.isArray(notif.users)) {
            const userIdx = notif.users.findIndex(
              (u) => u.userId === this.user._id
            );
            if (userIdx >= 0) {
              notif.users[userIdx].read = true;
            }
          }
        },
        (err) => {
          console.error("Error al marcar notificación como leída:", err);
        }
      );
  }

  // Cambiar de pestaña
  setFilter(filter: string) {
    this.filterType = filter;
  }

  cerrar() {
    this.dialogRef.close();
  }
}
