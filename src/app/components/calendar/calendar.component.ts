import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from 'src/app/services/events.service';
import { ShowEventComponent } from '../events/show-event/show-event.component';

// FullCalendar
import { CalendarOptions, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventContentArg, formatDate } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  events: any[] = [];
  _currentDate: Date;
  _currentMonth: number;
  _currentYear: number;

  constructor(
    private eventService: EventsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initializeCalendar(); // config de calendarOptions (sin cargar eventos aquí)
    setTimeout(() => {
      const today = new Date();
      const firstDayOfCurrent = new Date(today.getFullYear(), today.getMonth(), 1);
      this.currentMonth = today.getMonth() + 1;
      this.currentYear  = today.getFullYear();
      this.loadThreeAdjacentMonths(firstDayOfCurrent);
    }, 0);
  }

  // ==== GETTERS y SETTERS ====
  get currentDate(): Date {
    return this._currentDate;
  }
  set currentDate(value: Date) {
    this._currentDate = value;
    this.currentMonth = this.extractMonth(value);
    this.currentYear = this.extractYear(value);
  }

  get currentMonth(): number {
    return this._currentMonth;
  }
  set currentMonth(value: number) {
    this._currentMonth = value;
  }

  get currentYear(): number {
    return this._currentYear;
  }
  set currentYear(value: number) {
    this._currentYear = value;
  }

  // CONFIGURACIÓN INICIAL DEL CALENDARIO
  initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      locale: 'es-MX',
      editable: false,
      height: 'auto',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' },
      buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista' },
      events: this.events, 
      displayEventTime: false,       
      eventContent: this.renderEventContent.bind(this),
      datesSet: this.onMonthChanges.bind(this),
      eventClick: this.onEventClick.bind(this)
    };
  }

  renderEventContent(info: EventContentArg) {
    const { event } = info;
    const start = event.start;
    const end = event.end;

    const formatOpt = { hour: '2-digit' as const, minute: '2-digit' as const, hour12: true };
    const startText = start ? formatDate(start, formatOpt) : '';
    const endText = end ? formatDate(end, formatOpt) : '';
    const timeText = startText + (endText ? ` - ${endText}` : '');

    return {
      html: `
        <div class="fc-event-custom">
          <div class="event-title">${event.title}</div>
          <div class="event-time">${timeText}</div>
        </div>
      `
    };
  }

  // Carga eventos de mes anterior, actual y siguiente, y actualiza una sola vez el calendario 
private async loadThreeAdjacentMonths(refDate: Date): Promise<void> {
  const dates = [
    this.getOffsetMonth(refDate, -1),
    this.getOffsetMonth(refDate,  0),
    this.getOffsetMonth(refDate, +1),
  ];

  try {
    const responses = await Promise.all(
      dates.map(d =>
        this.eventService
          .getEvents(d.getMonth() + 1, d.getFullYear())
          .toPromise()
      )
    );

    const mergedEvents = responses.reduce((acc, arr) => acc.concat(arr), [] as any[]);

    // Mapear eventos al formato que espera FullCalendar
    this.events = mergedEvents
    .filter(ev => ev.status?.toLowerCase() === 'active')
    .map(ev => ({
      id: ev._id,
      title: ev.name,
      start: this.combineDateAndHour(ev, 'starttime'),
      end: this.combineDateAndHour(ev, 'endtime'),
      extendedProps: {
        description: ev.description,
        place: ev.place,
      }
    }));

    // Actualizar calendario con todos los eventos juntos
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events
    };

  } catch (err) {
    console.error('Error cargando eventos de los 3 meses contiguos', err);
  }
}


  // DETECTAR CAMBIO DE MES
  onMonthChanges(arg: DatesSetArg): void {
    const firstOfMonth = arg.view.currentStart;
    const newMonth = firstOfMonth.getMonth() + 1;
    const newYear  = firstOfMonth.getFullYear();

    if (newMonth !== this.currentMonth || newYear !== this.currentYear) {
      this.currentMonth = newMonth;
      this.currentYear  = newYear;
      this.loadThreeAdjacentMonths(firstOfMonth);
    }
  }


   // UTILIDADES
  private extractMonth(date: Date): number {
    return date.getMonth() + 1;
  }

  private extractYear(date: Date): number {
    return date.getFullYear();
  }

  // CLICK EN EVENTO
  onEventClick(eventClick: EventClickArg): void {
    this.getEvent(eventClick.event.id);
  }

  private async getEvent(eventId: string) {
    try {
      const event = await this.eventService.getEventById(eventId).toPromise();
      this.viewDetails(event);
    } catch (e) {
      console.error('Error al obtener detalle de evento', e);
    }
  }

  // MOSTRAR DETALLES EN MODAL 
  viewDetails(event: any): void {
    this.dialog.open(ShowEventComponent, {
      width: '600px',
      data: { event }
    });
  }

  // Combinar fecha + hora del evento
  private combineDateAndHour(event: any, timeKey: string = 'starttime'): string {
    if (!event.date || !event[timeKey]) return new Date().toISOString();

    const date = new Date(event.date);
    const timeString = event[timeKey].trim();
    const [hourMin, period] = timeString.split(' ');
    let [hours, minutes] = hourMin.split(':').map(Number);

    // Conversión a formato 24h
    if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  }

  //Helper para el manejo de fechas
  private getOffsetMonth(src: Date, offset: number): Date {
    const d = new Date(src.getTime()); 
    const initialMonth = d.getMonth();
    d.setDate(1);
    d.setMonth(initialMonth + offset);
    return d;
  }

}
