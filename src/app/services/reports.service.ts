import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Report } from '../models/report'; // ajusta la ruta según tu proyecto
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private api = environment.url + "/api/reports";

  constructor(private http: HttpClient) {}

  // ===================
  // GETTERS
  // ===================

  getAllMyReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.api}`);
  }

  getReportsForEvent(eventId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.api}/event/${eventId}`);
  }

  getReportById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.api}/report/${id}`);
  }

  // ===================
  // CRUD
  // ===================

  addReport(eventId: string, data: Partial<Report> | FormData) {
  return this.http.post(`${this.api}/event/${eventId}`, data);
  }

  editReport(id: string, data: Partial<Report> | FormData) {
    return this.http.put(`${this.api}/report/${id}`, data);
  }

  deleteReport(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/report/${id}`);
  }
}
