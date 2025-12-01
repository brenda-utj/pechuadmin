import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiposContratoService {

  constructor(private http: HttpClient) { }

  createTipo(userId: any, alianzas: FormData){
    return this.http.post(environment.url + '/api/tipo-contrato/new/' + userId, alianzas);
  }
  
  editTipo(id: any, userId: any, alianzas: FormData){
    return this.http.post(environment.url + '/api/tipo-contrato/edit/' + id + '/' + userId, alianzas);
  }

  getTipos(){
    return this.http.get(environment.url + '/api/tipo-contrato/get/');
  }

  deleteTipo(id: any, userId: any){
    return this.http.delete(environment.url + '/api/tipo-contrato/delete/' + id + '/' + userId);
  }
}