import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import Swal from 'sweetalert2';
import { ShowEventComponent } from './show-event/show-event.component';
import { AddEventComponent } from './add-event/add-event.component';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Para hacer clics
import { CalendarOptions } from '@fullcalendar/core';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  user: any = null;
  events: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'description', 'date', 'place', 'starttime', 'endtime', 'actions'];
  filtroTexto: string = '';
  selectedEvent: any = null;
  showForm: boolean = false;
  errorMessage: string = '';
  editMode: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$ = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventsService: EventsService,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService
  ) { }

  // ngOnInit(): void {
  //   this.eventsService.getEvents().subscribe(events => {
  //     this.dataSource = new MatTableDataSource(events);
  //   });
  //   this.loadEvents();
  //   this.getUser();
  // }
  ngOnInit(): void {
    this.getUser();
  }

  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }



  // Método para cargar los eventos desde el servicio
  // loadEvents(): void {
  //   this.eventsService.getEvents().pipe(takeUntil(this.destroy$)).subscribe(
  //     (events) => {

  //       // Filtrar según el rol o si es el usuario que lo agregó
  //       const filteredEvents = events.filter(event =>
  //         this.user?.role === 'super administrativo' || event.userAdd === this.user?._id
  //       );

  //       // Ordenar las vacantes por la propiedad 'createdAt' (de más reciente a más antigua)
  //       this.dataSource.data = events.sort((a, b) => {
  //         const dateA = new Date(a.createdAt).getTime();
  //         const dateB = new Date(b.createdAt).getTime();
  //         return dateB - dateA;
  //       });

  //       this.dataSource.paginator = this.paginator;
  //     },
  //     (error) => {
  //       this.dataSource.data = [];
  //       console.error('Error al cargar los eventos', error);
  //     }
  //   );
  // }
  loadEvents(): void {
    this.eventsService.getEvents().pipe(takeUntil(this.destroy$)).subscribe(
      (events) => {
        // Filtrar según el rol o si es el usuario que lo agregó
        const filteredEvents = events;

        // Ordenar de más reciente a más antiguo
        const sortedEvents = filteredEvents.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        this.dataSource = new MatTableDataSource(sortedEvents);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.dataSource = new MatTableDataSource([]);
        console.error('Error al cargar los eventos', error);
      }
    );
  }

  // Método para aplicar el filtro de búsqueda
  applyFilter(): void {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
  }

  //Método para eliminar un evento de la vista
  deleteEvent(id: string): void { 
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este evento se eliminará de la lista, pero seguirá existiendo en la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#3f51b5',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al servicio para eliminar el evento
        this.eventsService.deleteEvent(id, this.user._id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'El evento ha sido eliminado de la lista.', 'success');
            // Vuelve a cargar la lista de eventos después de la eliminación
            this.loadEvents();
          },
          (error) => {
            Swal.fire('Error!', 'Ocurrió un error al eliminar el evento.', 'error');
          }
        );
      }
    });
  }

  //Método para cancelar un evento
  // cancelEvent(id: string): void { 
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: 'Este evento será cancelado, pero seguirá existiendo en la base de datos.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, cancelar',
  //     cancelButtonText: 'No, volver',
  //     cancelButtonColor: 'red',
  //     confirmButtonColor: '#3f51b5',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Llama al servicio para eliminar el evento
  //       this.eventsService.cancelEvent(id, this.user._id).subscribe(
  //         () => {
  //           Swal.fire('Cancelado!', 'El evento ha sido cancelado con éxito.', 'success');
  //           // Vuelve a cargar la lista de eventos después de la eliminación
  //           this.loadEvents();
  //         },
  //         (error) => {
  //           Swal.fire('Error!', 'Ocurrió un error al cancelar el evento.', 'error');
  //         }
  //       );
  //     }
  //   });
  // }

  //Método para ver detalles de una vacante
  viewDetails(event: any): void {
  this.eventsService.getEventById(event._id).subscribe(
    (eventoCompleto) => {
      const dialogRef = this.dialog.open(ShowEventComponent, {
        width: '600px',
        data: { event: eventoCompleto }
      });

      dialogRef.afterClosed().subscribe(result => {
        // Puedes agregar lógica aquí si necesitas
      });
    },
    (error) => {
      console.error('Error al obtener detalles del evento:', error);
      // Opcional: mostrar alerta o mensaje de error al usuario
    }
  );
}


  openDialogEdit(event: any): void {
    this.selectedEvent = event;
    this.editMode = true;
    this.showForm = true;
    const dialogRef = this.dialog.open(AddEventComponent, { data: { event: this.selectedEvent } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }
  navigateToAddEvent(): void {
    this.selectedEvent = null;
    this.router.navigate(['/events/add'])
  }
  
  navigateToEditEvent(eventId: string): void {
    this.router.navigate([`/events/edit/${eventId}`]);
  }
  getUser() {
    this.authSvc.user.subscribe(
      (response) => {
        this.user = response;
        this.loadEvents(); // Auí se cargan los eventos solo después de tener el usuario
      },
      (error) => {
        console.error(error);
      }
    );
  }

getFormattedTime(time: any): string {
    if (!time) return '';

    let dateObj: Date;

    // Si ya es Date
    if (time instanceof Date) {
      dateObj = time;
    }
    // Si viene como string ISO
    else if (typeof time === 'string' && time.includes('T')) {
      dateObj = new Date(time);
    }
    // Si viene como "hh:mm AM/PM"
    else if (typeof time === 'string' && (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm'))) {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      }
      if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }

      dateObj = new Date();
      dateObj.setHours(hours, minutes, 0);
    }
    // Si viene como "HH:mm"
    else if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      dateObj = new Date();
      dateObj.setHours(hours, minutes, 0);
    }
    else {
      return '';
    }

    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  }

}
