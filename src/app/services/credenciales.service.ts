import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  constructor(private http: HttpClient) { }

  createCredential(data: any){
    return this.http.post(environment.url + '/api/credenciales/new', data);
  }

  updateCredential(data: any, id: any){
    return this.http.post(environment.url + '/api/credenciales/update/' + id, data);
  }

  getCredentials(){
    return this.http.get(environment.url + '/api/credenciales/get-all');
  }

  deleteCredential(data: any, id: any){
    return this.http.post(environment.url + '/api/credenciales/delete/' + id, data);
  }
}
