import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Note } from '../models/note'; // ajusta la ruta según tu proyecto
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private api = environment.url + "/api/notes";

  constructor(private http: HttpClient) {}

  // ===================
  // GETTERS
  // ===================

  getAllMyNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}`);
  }

  getNotesForEvent(eventId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/event/${eventId}`);
  }

  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.api}/note/${id}`);
  }

  // ===================
  // CRUD
  // ===================

  addNote(eventId: string, data: Partial<Note> | FormData) {
  return this.http.post(`${this.api}/event/${eventId}`, data);
  }

  editNote(id: string, data: Partial<Note> | FormData) {
    return this.http.put(`${this.api}/note/${id}`, data);
  }

  deleteNote(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/note/${id}`);
  }
}
