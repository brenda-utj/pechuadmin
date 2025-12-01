import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VacanteService {
  constructor(private http: HttpClient) { }

  getVacantes(): Observable<any[]> {
    return this.http.get<any[]>(environment.url + '/api/vacante/all');
  }

  getVacanteById(id: string): Observable<any> {
    return this.http.get(`${environment.url}/api/vacante/${id}`);
  }

  addVacante(vacanteData: any, userId: string): Observable<any> {
    return this.http.post(environment.url + '/api/vacante/new/' + userId, vacanteData);
  }

  editVacante(id: string, vacanteData: any, userId:string): Observable<any> {
    return this.http.put(environment.url + '/api/vacante/update/' + id + '/' + userId, vacanteData);
  }

  getPuestos(): Observable<any> {
    return this.http.get(environment.url + '/api/puestos/get');
  }

  getTiposEmpleados(): Observable<any> {
    return this.http.get(environment.url + '/api/tipoempleado/get');
  }

  getZonas(): Observable<any> {
    return this.http.get(environment.url + '/api/zonas/get');
  }

  getSucursales(): Observable<any> {
    return this.http.get(environment.url + '/api/sucursales/get');
  }

  getTiposContratos(): Observable<any> {
    return this.http.get(environment.url + '/api/tipocontratos/get');
  }

  deleteVacante(id: string, userId:string): Observable<any> {
    return this.http.delete(environment.url + '/api/vacante/delete/' + id + '/' + userId);
  }

  updateVacanteStatus(id: string, userId:string ) : Observable<any> { 
    return this.http.put(`${environment.url}/api/vacante/status/${id}/${userId}`, {}); 
  }
}