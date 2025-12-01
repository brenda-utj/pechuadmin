import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private http: HttpClient) { }

  getEvents(month?: number, year?: number): Observable<any[]> {
    let urlComplement = '';
  
    if (month) {
      urlComplement += `?month=${month}`;
    }
  
    if (year) {
      urlComplement += urlComplement ? `&year=${year}` : `?year=${year}`;
    }
  
    return this.http.get<any[]>(`${environment.url}/api/events/all${urlComplement}`);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`${environment.url}/api/events/${id}`);
  }

  addEvent(eventData: any, userId: string, emails: string[]): Observable<any> {
    return this.http.post(`${environment.url}/api/events/new/${userId}`, eventData);
  }
  
  editEvent(id: string, eventData: any, userId: string): Observable<any> {  
    return this.http.put(`${environment.url}/api/events/update/${id}/${userId}`, eventData);
  }
  
  
  deleteEvent(id: string, userId: string): Observable<any> {
    return this.http.delete(`${environment.url}/api/events/delete/${id}/${userId}`);
  }

  loadData(): Observable<any[]> {
    return this.getEvents(); // Llama a getEvents para obtener todos los eventos
  }
}