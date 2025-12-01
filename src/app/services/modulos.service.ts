import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class ModulosService {

  constructor(private http: HttpClient) { }

  createModule(data: any){
    return this.http.post(environment.url + '/api/modulos/new', data);
  }

  updateModule(data: any, id: any){
    return this.http.post(environment.url + '/api/modulos/update/' + id, data);
  }

  updateViewModule(data: any, id: any){
    return this.http.post(environment.url + '/api/modulos/update-view/' + id, data);
  }

  getModules(){
    return this.http.get(environment.url + '/api/modulos/get-all');
  }

  deleteModule(data: any, id: any){
    return this.http.post(environment.url + '/api/modulos/delete/' + id, data);
  }
}
